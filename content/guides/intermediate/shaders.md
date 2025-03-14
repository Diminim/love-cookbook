---
title: "Shaders"
authors: [Jasper]
date: 2025-03-05
---

> [!CAUTION]
> This guide is made for LÖVE 12.0!

With **shaders** we can create fun but advanced graphical effects for our games.
Ranging from simple color changes to complex post-processing effects.

There are multiple types of shaders available to be used in LÖVE
* The **Fragment**, also known as the **Pixel** shader
* The **Vertex** shader
* The **Compute** shader

A shader edits the color of what's drawn, like when drawing images or text.

Shaders can be created using `love.graphics.newShader`.
Compute shaders are covered in the [Compute Shaders](compute-shaders) guide, but it's more advanced and it's recommended to read this guide first.

## Syntax

LÖVE shaders are written in the shading language GLSL, which is quite a bit different to lua.
Because of this, we can transfer shaders between different engines and languages, like Unity, with some minor changes.

Let's compare the syntax of a simple shader in GLSL and lua.

### Variables
```lua
local x = 1.0
local y = 2.0
local z = x + y
```

```glsl
float x = 1.0;
float y = 2.0;
float z = x + y;
```

### Conditionals
```lua
if x > y then
    return x
else
    return y
end
```

```glsl
if (x > y)
{
    return x;
}
else
{
    return y;
}
```

### Loops
```lua
local sum = 0

for i = 0, 10 do
    sum = sum + i
end
```

```glsl
int sum = 0;

for (int i = 0; i < 11; i++)
{
    sum += i;
}
```

### Functions
```lua
function add(x, y)
    return x + y
end
```

```glsl
float add(float x, float y)
{
    return x + y;
}
```

### Arrays
```lua
local array = { 1, 2, 3 }
```

```glsl
int array[3] = { 1, 2, 3 };
```

### Structs
```lua
local myData = { 
    x = 1, 
    y = 2,
    isActive = true
}
```

```glsl
struct {
    float x;
    float y;
    bool isActive;
} MyDataStruct;

MyDataStruct myData = { 1.0, 2.0, true };
```

GLSL also supports overloading, meaning you can have multiple functions with the same name, as long as the parameters are different.

## The Fragment shader
This shader is executed for every pixel the effect covers.
This is possible because shaders are really fast and so is the GPU.
Let's make a simple fragment shader from a string to show it's functionality.

During this guide, we will be creating new shader files, usually with the `.fs`: Fragment Shader, `.vs`: Vertex Shader or `.glsl` extension.

We start by defining the output, `vec4`.        
`vec4 color` is the color we provide with `love.graphics.setColor`.      
`Image tex` is the texture of our draw call, like the image from `love.graphics.draw(image)`.        
`vec2 texture_coords` are the uv-coordinates defined by the vertices of our mesh or automatically by LÖVE for images and similar [0-1].     
`vec2 screen_coords` are the coordinates on screen, [0.5 to love_ScreenSize.xy-0.5].      

### Grayscale color

`main.lua`
```lua
local shaderCode = [[
// This is one of the "entry points" supported by LÖVE.
vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords)
{
    float gray = length(color.rgb);
    // Colors are returned as (Red, Green, Blue, Alpha)
    return vec4(gray, gray, gray, 1.0); // Color the square gray
}
]]

local shader = love.graphics.newShader(shaderCode)

function love.draw()
    love.graphics.setShader(shader)
    -- We'll draw a couple of differently colored squares to see the effect
    love.graphics.setColor(1, 0.2, 0)
    love.graphics.rectangle("fill", 100, 100, 200, 200)

    love.graphics.setColor(0, 1, 0.5)
    love.graphics.rectangle("fill", 400, 100, 200, 200)

    love.graphics.setColor(0.3, 0, 1)
    love.graphics.rectangle("fill", 700, 100, 200, 200)
end
```

---

### Drawing images

Let's step things up by drawing an image this time and by using a different file instead of a string.     
We'll have to change our shader a bit to allow it to draw images.       
We do this by telling the shader to load the color values of our image when coloring a pixel.

`drawImage.fs`
```glsl
vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords)
{
    // Use Texel to sample the color of a texture at a coordinate
    vec4 imageColor = Texel(tex, texture_coords);

    // Make the image red by multiplying by our Red vec4
    return imageColor * vec4(1.0, 0.0, 0.0, 1.0);
}
```

`main.lua`
```lua
local image = love.graphics.newImage("YourImage.png")

local shader = love.graphics.newShader("drawImage.fs")

function love.draw()
    love.graphics.setShader(shader)
    love.graphics.draw(image)
end
```

---

### Uniform values

Uniform values are a way for LÖVE send data from Lua to GLSL **Not the other way around!**     
Let's edit our shader to change the color of our image over time, using a uniform value.

> [!NOTE]
> Uniform values can get optimised out of shader code,      
> if shader:send is encountering an error even though the uniform is defined,
> make sure it's contributing to the final output of the shader.

`unusedUniform.fs`

```glsl
uniform float AUniformValue;

vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords)
{
    return vec4(1.0);
}
```

`main.lua`

```lua
local shader = love.graphics.newShader("unusedUniform.fs")

function love.draw()
    shader:send("AUniformValue", 1.0)
    love.graphics.setShader(shader)
    love.graphics.rectangle("fill", 100, 100, 200, 200)
end
```

This will throw an error, because the uniform value is not used in the shader code.

```
Error

main.lua:4: Shader uniform 'AUniformValue' does not exist.
A common error is to define but not use the variable.
```


```lua
local image = love.graphics.newImage("YourImage.png")

local shaderCode = [[

// Add a uniform vec4, which we can edit in lua.
uniform vec4 ColorOffset;

vec4 effect(vec4 color, Image tex, vec2 texture_coords, vec2 screen_coords)
{
    // Use Texel to sample the color of a texture at a coordinate
    vec4 imageColor = Texel(tex, texture_coords);

    // Make the image red by multiplying by our Red vec4
    return imageColor * vec4(1.0, 0.0, 0.0, 1.0) + ColorOffset;
}
]]

local shader = love.graphics.newShader(shaderCode)
local colorOffset = { 0, 0, 0, 0 }

local time = 0

function love.update(dt)
    time = time + dt
end

function love.draw()
    -- Create a sin-wave [0-1], as the green color to add.
    shader:send("ColorOffset", { 
        0, 
        math.sin(time) * 0.5 + 0.5, -- Multiplying by 0.5 and adding 0.5 brings the sin wave from [-1, 1 to [0, 1]
        0, 
        0
    })

    love.graphics.setShader(shader)
    love.graphics.draw(image)
end
```

## Vertex shaders

Vertex shaders are programs which calculate the final position of a vertex on screen.     

Let's start with the standard shader LÖVE uses and break it down.

```glsl
varying vec4 vpos;

vec4 position( mat4 transform_projection, vec4 vertex_position )
{
    vpos = vertex_position;
    return transform_projection * vertex_position;
}
```

`varying` is a keyword which defines a variable that will be shared between the vertex and fragment shader stage.       
By default, these values are interpolated, meaning halfway between, for example, pure red and green, the final value will be [0.5, 0.5, 0.0]

{% love 200, 200, true %}
local PI13 = math.pi * 2 / 3
local mesh = love.graphics.newMesh({
    { 100 + math.cos(PI13 * 2 + math.pi / 6) * 100, 120 + math.sin(PI13 * 2 + math.pi / 6) * 100, 0, 0, 1, 0, 0 },
    { 100 + math.cos(PI13 * 3 + math.pi / 6) * 100, 120 + math.sin(PI13 * 3 + math.pi / 6) * 100, 0, 0, 0, 1, 0 },
    { 100 + math.cos(PI13 + math.pi / 6) * 100,     120 + math.sin(PI13 + math.pi / 6) * 100,     0, 1, 0, 0, 1 },
}, "triangles", "static")

function love.draw()
    love.graphics.draw(mesh)
end

{% endlove %}

`mat4 transform_projection` is the variable which is doing all of the hard work,        
it's the matrix which stores the current coordinate system transform, so translation, rotation and scale and the projection matrix.         
By default LÖVE uses an orthographic projection matrix which goes [-10, 10] on the z-axis, meaning if objects are outside of that range, they won't be visible anymore.        
This is because the z values of the pixels will lie outside of the [-1 to 1] range and the gpu will "clip" the fragments.

`vec4 vertex_position` is the input vertex's position, by default `w = 1`, any time a position is multiplied with a projection matrix, it should be `1` otherwise it will cause issues.

Let's do some shader magic and create a vertex shader which automatically covers the entire screen with a single triangle, instead of having to create a 1x1 image like we did before.

## Fullscreen triangle

One thing to note is that this shader is written with `void vertexmain` instead of `vec4 position`, because we don't need the standard inputs.

`fullscreenTriangle.vs`
```glsl
// Store UV-Coordinates to be used in the fragment shader
varying vec2 VarVertexCoord;
#ifdef VERTEX
void vertexmain() {
    // We want a triangle which covers the entire screen, so we need to generate a triangle with vertices at the positions:
    // [0, 0], [0, 2], [2, 0]
    
    // Bit shifting magic to create these coordinates
    VarVertexCoord = vec2((love_VertexID << 1) & 2, love_VertexID & 2);

    vec4 VarScreenPosition = vec4(VarVertexCoord.xy * vec2(2.0) + vec2(-1.0), 0.0, 1.0);

    gl_Position = VarScreenPosition;
}
#endif
```

There are some limitations to take in to consideration when writing shader code, the main one is that, due to the way GPUs work the entire register usage needs to be known beforehand, meaning dynamic memory allocations like these:
```glsl
uniform int IntCount;
uniform int[IntCount] UniformIntegers
```
aren't allowed.     
Which leads to another limitation, recursive code is not allowed either, use a stack and a while loop instead.

### Types

Scalar types:
* `float`: 32-bit floating point number, for storing fractional values
* `int`: 32-bit integer value
* `uint`: unsigned version of int, meaning it can't be negative, allowing for twice the range of values
* `bool`: boolean value (`true` or `false`)

Vector types:
* `vecn`: float type vector
* `ivecn`: integer type vector
* `uvecn`: unsigned integer type vector
* `bvecn`: boolean type vector

Matrix types:
* mat*n*x*m*: n columns, m rows (column major) 

>[!NOTE] Matrices are a way to store a 2D array of values, like a 4x4 array of floats.
> Matrices are very useful for transforming coordinates, like rotating, scaling and translating.


>[!IMPORTANT]
> When doing math in shaders, make sure to use the correct literal number formatting        
> `1 / 2 = 0` Values without type suffixes will be interpreted as integers      
> `1.0 / 2.0 = 0.5` Floating point division

Type suffixes
* `float`: *x*.;*x*.0;*x*.f (1. ; 1.0 ; 1.f)
* `int`: *x* ( 1 )
* `uint` *x*u ( 1u )

[This](https://learnwebgl.brown37.net/12_shader_language/glsl_mathematical_operations.html) page explains operators.

## Object Management
When providing shaders with objects, like `Textures` and `Buffers`
we provide the reference to the data already stored in VRAM. 

Meaning if we for example, send a canvas to a shader and render to it with a `setCanvas` call, the memory in VRAM will have changed.
So when using that canvas later, the contents will be different from when you sent the image, as it's just a reference.
Sending images and buffers to the gpu is expensive (Using newTexture, newBuffer or similar), but sending the reference (Using shader:send) is not.

## Shader optimisation

While shader optimisation is an incredibly advanced topic, these are still some useful tips to keep in mind while creating stunning effects!

* Try to minimise texture samples, and try to keep the position consistent and close to the source.
* The gpu is great at doing a lot of small tasks at the same time, so try to avoid really long for loops or huge shaders.
* Implicit conversions, while doing a multiplication two different types is fine, try to avoid it in a for loop if possible, converting an int to a float once is better than 100x!
* Precision qualifiers, these don't do anything on desktop gpus but mobile devices do calculations a lot faster at lower precisions.

These are also useful but might not be as relevant when creating normal effects.
* Data packing, instead of using 4 32-bit integers to store 4 8-bit integer values, if the size is known beforehand, they can be packed before writing and unpacked before reading.
* Register usage, using more registers (determined by the maximum amount of values used at any point in a shader) *can* cause the shader to run slower.
