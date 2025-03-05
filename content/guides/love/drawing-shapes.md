---
title: "Drawing shapes"
authors: [josh]
date: 2025-02-24
---

LÖVE comes equipped with a variety of shape drawing functions and in this tutorial we're going to go through them.

## Rectangles
Drawing rectangles is straightforward: we provide the x and y position of the top-left corner and a width and height. We also instruct whether we want the rectangle to be filled or just an outline.

This is the simplest rectangle we can draw with the {% api "love.graphics.rectangle" %} function:
```lua
function love.draw()
    love.graphics.rectangle("fill", 50, 50, 100, 50)
end
```

Breaking down the parameters we have:
* DrawMode - "line" or "fill"; self-explanatory.
* x - the x position of the top-left corner of the rectangle.
* y - the y position of the top-left corner of the rectangle.
* width - the width in pixels.
* height - the height in pixels.

This leaves us with a rectangle of 100x50 pixels starting at 50,50:

{% love 200,200 %}
function love.draw()
    love.graphics.rectangle("fill", 50, 50, 100, 50)
end
{% endlove %}

Let's draw some more rectangles: some filled and some with just outlines:
```lua 3,6,9,12
function love.draw()
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.rectangle("line", 100, 60, 100, 50)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.rectangle("line", 125, 75, 100, 50)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.rectangle("fill", 300, 60, 100, 50)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.rectangle("fill", 325, 75, 100, 50)
end
```

{% love 800,200 %}
function love.draw()
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.rectangle("line", 100, 60, 100, 50)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.rectangle("line", 125, 75, 100, 50, 16, 8)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.rectangle("fill", 300, 60, 100, 50)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.rectangle("fill", 325, 75, 100, 50, 16, 8)
end
{% endlove %}

Did you notice the 2 rounded rectangles? That's because there are actually extra optional parameters that you can provide {% api "love.graphics.rectangle" %} to change corner radii!

* rx - the x radius of the rounded corner
* ry - the y radius of the rounded corner

Here we provided 16 for the x and 8 for the y so the corners are skewed horizontally.

## Circles
Drawing circles is even easier - we use {% api "love.graphics.circle" %} in a very similar way to `love.graphics.rectangle`:

```lua 3,6,9,12
function love.draw()
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.circle("line", 100, 60, 32)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.circle("line", 125, 75, 32)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.circle("fill", 300, 60, 32)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.circle("fill", 325, 75, 32)
end
```

Very similar to rectangle:
* DrawMode - "line" or "fill"; self-explanatory
* x - the x position of the *center* of the circle.
* y - the y position of the *center* of the circle.
* radius - the radius in pixels.

> [!NOTE]
> Notice that unlike rectangles we provide the **center** position here!

{% love 800,200 %}
function love.draw()
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.circle("line", 100, 60, 32)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.circle("line", 125, 75, 32)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.circle("fill", 300, 60, 32)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.circle("fill", 325, 75, 32)
end
{% endlove %}

## Lines
As you might expect lines are drawn with {% api "love.graphics.line" %}:

It takes a set of 4 parameters:
* x
* y
* x2
* y2

and draws a line from x,y -> x2,y2. Unlike the other functions we've covered so far, however, you can continue to provide further sets of 2 to make a continuous line drawing from point to point (see the highlighted lines below):

```lua 7-11
function love.draw()
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.line(50, 50, 100, 100)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.line(
        125, 75,
        200, 20,
        300, 150,
        350, 100,
        125, 75 -- back to the start!
    )
end
```
{% love 800,200 %}
function love.draw()
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.line(50, 50, 100, 100)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.line(
        125, 75,
        200, 20,
        300, 150,
        350, 100,
        125, 75
    )
end
{% endlove %}

## Points
Singular points are drawn with {% api "love.graphics.points" %} and has essentially the same parameters as `love.graphics.line`:

```lua
function love.draw()
    love.graphics.setPointSize(1)
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.points(50, 50, 100, 100)

    love.graphics.setPointSize(3)
    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.points(
        125, 75,
        200, 20,
        300, 150,
        350, 100
    )
end
```

> [!NOTE]
> The default point size of 1 pixel makes it a little tricky to spot so for the second example (highlighted above) we use {% api "love.graphics.setPointSize" %} to make them a bit bigger.

{% love 800,200 %}
function love.draw()
    love.graphics.setPointSize(1)
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.points(50, 50, 100, 100)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.setPointSize(3)
    love.graphics.points(
        125, 75,
        200, 20,
        300, 150,
        350, 100
    )
end
{% endlove %}

## Polygons
Like with points and lines we provide a set of positions for the polygon to draw with but we have a `Draw Mode` parameter to pass first (like with [rectangles](#rectangles) and [circles](#circles)).

> [!WARNING]
> The polygon *must* be convex and non-self-intersecting when in fill mode!

We draw polygons with {% api "love.graphics.polygon" %}:

```lua
function love.draw()
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.polygon(
        "line",
        100, 50,
        50, 150,
        150, 150
    )

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.polygon(
        "fill",
        250, 50,
        200, 150,
        300, 150
    )
end
```

{% love 800,200 %}
function love.draw()
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.polygon(
        "line",
        100, 50,
        50, 150,
        150, 150
    )

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.polygon(
        "fill",
        250, 50,
        200, 150,
        300, 150
    )
end
{% endlove %}

## Ellipse
Ellipses are like circles but with 2 radius parameters. One for the horizontal radius and one for the vertical:
* DrawMode - "line" or "fill"; self-explanatory
* x - the x position of the *center* of the circle.
* y - the y position of the *center* of the circle.
* x radius - the x radius in pixels.
* y radius - the y radius in pixels.

```lua 3,6,9,12
function love.draw()
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.ellipse("line", 100, 100, 32, 16)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.ellipse("line", 100, 100, 16, 32)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.ellipse("fill", 300, 60, 64, 8)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.ellipse("fill", 325, 75, 8, 8)
end
```

> [!NOTE]
> Notice that like circles we provide the **center** position here!

{% love 800,200 %}
function love.draw()
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.ellipse("line", 100, 100, 32, 16)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.ellipse("line", 100, 100, 16, 32)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.ellipse("fill", 300, 100, 64, 8)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.ellipse("fill", 300, 100, 8, 8)
end
{% endlove %}

## Arcs
We can draw arcs with {% api "love.graphics.arc" %}. There are variants of this function, one specifying the {% api "ArcType" %} and one without (defaulting to `pie`).

* DrawMode - "line" or "fill"
* ArcType - "pie", "open" or "closed" - this one is optional! If skipped then `pie` will be used.
* x - x position of the *center* of the arc.
* y - y position of the *center* of the arc.
* radius - radius of the arc in pixels.
* angle1 - this is the angle to start the arc from in radians.
* angle2 - this is where the angle ends in radians.

> [!NOTE]
> Note that the angles are in **radians**: not degrees!
>
> You can convert between the 2 with the standard Lua functions `math.deg` and `math.rad`.

```lua
function love.draw()
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.arc("line", 100, 60, 32, math.pi / 4, math.pi)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.arc("line", 125, 75, 32, 0, love.timer.getTime() % math.pi * 2)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.arc("fill", 300, 60, 32, 0, math.pi)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.arc("fill", 325, 75, 32, 0, love.timer.getTime() % math.pi * 2)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.arc("line", "open", 500, 60, 32, math.pi / 4, math.pi)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.arc("line", "closed", 700, 60, 32, math.pi / 4, math.pi)
end
```

{% love 800,200 %}
function love.draw()
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.print("pie", 100, 20)
    love.graphics.arc("line", 100, 60, 32, math.pi / 4, math.pi)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.arc("line", 125, 75, 32, 0, love.timer.getTime() % math.pi * 2)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.arc("fill", 300, 60, 32, 0, math.pi)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.arc("fill", 325, 75, 32, 0, love.timer.getTime() % math.pi * 2)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.print("open", 500, 20)
    love.graphics.arc("line", "open", 500, 60, 32, math.pi / 4, math.pi)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.print("closed", 700, 20)
    love.graphics.arc("line", "closed", 700, 60, 32, math.pi / 4, math.pi)
end
{% endlove %}

## Bonus
### Line styles
For shapes in line mode we have control over how thick those lines are rendered using the function {% api "love.graphics.setLineWidth" %}:

```lua 4
local line_width = 4

function love.draw()
    love.graphics.setLineWidth(line_width)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.circle("line", 100, 100, 32)
    love.graphics.line(232, 200, 232, 264)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.rectangle("line", 200, 100 - 32, 64, 64)
    love.graphics.polygon(
        "line",
        166 - 32, 200,
        166 + 32, 200,
        166, 264
    )

    love.graphics.setColor(0.98, 0.73, 0.67)
    love.graphics.arc("line", 300, 200, 32, 0, math.pi / 2)
    love.graphics.ellipse("line", 350, 100, 48, 16)
end

function love.keypressed(key)
    if key == "up" then
        line_width = line_width + 1
    elseif key == "down" then
        line_width = line_width - 1
    end

    line_width = math.max(1, line_width)
end
```

> [!NOTE]
> Try pressing the `up` and `down` keys to change the line width!

{% love 450,300 %}
local line_width = 4

function love.draw()
    love.graphics.setLineWidth(line_width)

    love.graphics.setColor(0.93, 0.52, 0.58)
    love.graphics.circle("line", 100, 100, 32)
    love.graphics.line(232, 200, 232, 264)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.rectangle("line", 200, 100 - 32, 64, 64)
    love.graphics.polygon(
        "line",
        166 - 32, 200,
        166 + 32, 200,
        166, 264
    )

    love.graphics.setColor(0.98, 0.73, 0.67)
    love.graphics.arc("line", 300, 200, 32, 0, math.pi / 2)
    love.graphics.ellipse("line", 350, 100, 48, 16)
end

function love.keypressed(key)
    if key == "up" then
        line_width = line_width + 1
    elseif key == "down" then
        line_width = line_width - 1
    end

    line_width = math.max(1, line_width)
end
{% endlove %}

### Flower
Just for fun let's combine a lot of these to make a simple scene:

```lua 9-16,28-32,49,53,60,64
local function draw_leaf(x, y, rotation)
    local leaf_height = 50
    local leaf_half_width = 5

    love.graphics.push()
    love.graphics.translate(x, y)
    love.graphics.rotate(rotation)

    love.graphics.polygon("fill",
        0, 0,
        -leaf_half_width, leaf_height / 3,
        -leaf_half_width, leaf_height / 3 * 2,
        0, leaf_height,
        leaf_half_width, leaf_height / 3 * 2,
        leaf_half_width, leaf_height / 3
    )

    love.graphics.pop()
end

function love.draw()
    -- Set the origin to be 100,100
    love.graphics.translate(100, 100)

    -- Draw a green stem
    love.graphics.setLineWidth(4)
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.line(
        0, 16,
        0, 100,
        5, 200
    )

    local t = love.timer.getTime()
    draw_leaf(0, 75, (math.pi / 3) + math.sin(t) / 8)
    draw_leaf(0, 100, (5 * math.pi / 3) + math.cos(t) / 8)

    love.graphics.setLineWidth(2)

    local petal_count = 7
    for i = 1, petal_count do
        -- Rotate around the center by an amount depending on which petal we're drawing
        love.graphics.push()
        love.graphics.rotate((2 * math.pi / petal_count) * (i - 1) + t)
        love.graphics.translate(40, 0)

        -- Draw a filled ellipse for the petal
        love.graphics.setColor(0.93, 0.52, 0.58)
        love.graphics.ellipse("fill", 0, 0, 32, 16)

        -- Draw an outline of the petal
        love.graphics.setColor(0.16, 0.15, 0.19)
        love.graphics.ellipse("line", 0, 0, 32, 16)

        love.graphics.pop()
    end

    -- The center of the flower (called a pistil!)
    love.graphics.setColor(0.16, 0.15, 0.19)
    love.graphics.circle("fill", 0, 0, 16)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.setPointSize(8)
    love.graphics.points(0, 0)
end
```

> [!NOTE]
> Don't worry if a lot of this is unfamilar!
>
> Some of the concepts like the transformation stack (`love.graphics.push/pop/translate/scale`) will be covered in later chapters.

{% love 200,350 %}
local function draw_leaf(x, y, rotation)
    local leaf_height = 50
    local leaf_half_width = 5

    love.graphics.push()
    love.graphics.translate(x, y)
    love.graphics.rotate(rotation)

    love.graphics.polygon("fill",
        0, 0,
        -leaf_half_width, leaf_height / 3,
        -leaf_half_width, leaf_height / 3 * 2,
        0, leaf_height,
        leaf_half_width, leaf_height / 3 * 2,
        leaf_half_width, leaf_height / 3
    )

    love.graphics.pop()
end

function love.draw()
    -- Set the origin to be 100,100
    love.graphics.translate(100, 100)

    -- Draw a green stem
    love.graphics.setLineWidth(4)
    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.line(
        0, 16,
        0, 100,
        5, 200
    )

    local t = love.timer.getTime()
    draw_leaf(0, 75, (math.pi / 3) + math.sin(t) / 8)
    draw_leaf(0, 100, (5 * math.pi / 3) + math.cos(t) / 8)

    love.graphics.setLineWidth(2)

    local petal_count = 7
    for i = 1, petal_count do
        -- Rotate around the center by an amount depending on which petal we're drawing
        love.graphics.push()
        love.graphics.rotate((2 * math.pi / petal_count) * (i - 1) + t)
        love.graphics.translate(40, 0)

        -- Draw a filled ellipse for the petal
        love.graphics.setColor(0.93, 0.52, 0.58)
        love.graphics.ellipse("fill", 0, 0, 32, 16)

        -- Draw an outline of the petal
        love.graphics.setColor(0.16, 0.15, 0.19)
        love.graphics.ellipse("line", 0, 0, 32, 16)

        love.graphics.pop()
    end

    -- The center of the flower (called a pistil!)
    love.graphics.setColor(0.16, 0.15, 0.19)
    love.graphics.circle("fill", 0, 0, 16)

    love.graphics.setColor(0.29, 0.56, 0.58)
    love.graphics.setPointSize(8)
    love.graphics.points(0, 0)
end
{% endlove %}

Pretty!