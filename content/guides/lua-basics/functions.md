---
title: "Functions"
authors: [Sheepolution]
date: 2025-02-19
---

With **functions** we can store a piece of code to be executed at different times, and multiple times.

There are two ways to create a function:

```lua
-- A function is a type of value, like a number and a string.
local hello = function ()
    print("Hello world!")
end

-- This is the common way!
local function hello()
    print("Hello world!")
end
```

We have now created a function that, when executed, will print `Hello world!`. We can execute our function like so:

```lua
local function hello()
    print("Hello world!")
end

hello() -- Output: Hello world!
```

> [!NOTE]
> Executing a function is called a **function call**. So in the example above we <ins>call</ins> the function `hello`.

## Parameters

Parameters are special kind of variables that functions can have. In the example below, the function has the parameter `animal`. What we put inbetween the parantheses when we call the function decides the value of the parameter for that function call.

```lua
local function favorite(animal)
    print("My favorite animal is the " .. animal .. ".")
end

favorite("whale") -- Output: My favorite animal is the whale.
favorite("bear") -- Output: My favorite animal is the bear.
favorite("tiger") -- Output: My favorite animal is the tiger.
print(animal) -- Output: nil
```

At the end we print `animal`, and it outputs `nil`. This is because parameters are automatically <ins>local variables</ins>. They are only available inside that function.

> [!NOTE]
> The value we put inbetween the parantheses is called the **argument**.
>
> Adding an argument to your function call is called **passing**.
>
> So in the example above we <ins>pass</ins> the <ins>argument</ins> `"whale"`, `"bear"`, and `"tiger"`.

## Return

{% abstract "A return-statement ends the execution of a function, and allows you to return a value for the function-call." %}

Functions can **return** a value. This means that, upon calling the function, it will give us a value back.

```lua
-- We can create multiple parameters by separating them with a comma.
local function give_me_five()
    return 5
end

local five = give_me_five()
print(five) -- Output: 5
```

When a function reaches the `return` keyword, it is the end of that function call, and `end` should follow. Trying to place code after the `return` will cause an error.

```lua
local function sum(a, b)
    return a + b
    print(a, b) -- Error!
end

sum(10, 20)
```

A function can have multiple parameters, arguments, and return-values, by separating them with a comma.

```lua
local function arithmetics(a, b)
    -- 'a' becomes the value of 'a' multiplied by 2.
    a = a * 2
    -- 'b' becomes the value of 'b'  divided by 2.
    b = b / 2

    return a, b
end

print(arithmetics(5, 40)) -- Ouput: 10, 20
```

## Callbacks

{% abstract "A callback is a function that is passed to another function. The latter function will, at some point, call the callback, often while passing useful information." %}

As we stated earlier, when we execute a function, we call that a <ins>function call</ins>. It's as if we're *calling* someone to help us with something.

```lua
local function my_math_teacher(a, b)
    return a - b
end

print(my_math_teacher(10, 4))
```

Here we call our math teacher to ask him what 10 minus 4 is. I don't think we're gonna get good grades.

In fact, our math teacher isn't gonna be so helpful this time. He wants us to do the math ourselves. When we call him, we need to provide a function. Using a function like this is called a **callback**. It's as if we provide a phone number for him to <ins>call back</ins>.

```lua
local function my_math_teacher(f)
    f(8, 2)
end

local function addition (a, b)
    print(a + b) -- Output: 10
end

my_math_teacher(addition)

-- We don't necessarily need to assign it in a variable first.
-- We call this an anonymous function.
my_math_teacher(function (a, b)
    print(a - b) -- Output: 6
end)
```

We call the function `my_math_teacher`, and pass a function (a <ins>callback</ins>) for the parameter `f`. Our teacher then calls this function, and passes two numbers. Our function `addition` prints the summed up numbers.

In the second call we pass a function as we create it. We don't assign it in a variable first. We call this an **anonymous function**.

> [!NOTE]
> `love.load`, `love.update` and `love.draw` are also callbacks. We provide LÖVE with a function to call upon these events happening.

## Usage

Functions allow us to execute the same code in different places, without having to copy that code. Instead we can call the function. If we ever want to change how the code works, we only need to change the function.

In the example below we draw multiple rectangles. If we ever want to change the shape of all the rectangles, we only need to change the function.

{% love 800, 200, true %}
local function draw_rectangle(x)
    love.graphics.rectangle("fill", x, 10, 100, 75)
end

function love.draw()
    draw_rectangle(10)
    draw_rectangle(130)
    draw_rectangle(250)
    draw_rectangle(370)
end
{% endlove %}

## Challenge

Can you figure out what the code below will output?
```lua
local function sum(a, b)
    return a + b
end

local function subtract(a, b)
    return a - b
end

-- The returned values of 'sum' are passed as arguments for 'subtract'.
local result = subtract(sum(6, 4), sum(1, 2))
print(result)
```