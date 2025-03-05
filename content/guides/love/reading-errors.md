---
title: "Reading errors"
authors: [josh]
date: 2025-02-23
---

Running into errors in your code is an inevitable part of the process and it's important to understand how to read them effectively.

## Example

Let's do something silly to generate an error on purpose:

```lua
function love.draw()
    love.graphics.print(100 * "test", 10, 10)
end
```

Running the above code will present you with a nice error message that looks like this:

![](/assets/img/reading-errors/error.png)

## Error message breakdown
Let's quickly break down what this means before your eyes glaze over and you close the window without reading it - a common beginner pitfall.

The most important part is at the very beginning of the second line. `main.lua:2` means that the error was thrown in the file `main.lua` on line 2. This is always a good place to start and will usually be where you will have to correct your code in order to resolve the issue. The rest of the line is telling us what the error actually was.

* `main.lua` - the file
* `:2` - line 2
* `attempt to perform arithmetic on a string value` - the error message

In this case we know the issue is that we're attempting to multiply the number 100 by a string ("test") on line 2 which makes absolutely no sense and LÖVE is right to complain.

## Less obvious errors
This code will throw a different kind of error:
```lua
local image = love.graphics.newImage("assets/whale.png")

function love.draw()
    love.graphics.draw(picture, 100, 100)
end
```

![](/assets/img/reading-errors/error_drawable_expected.png)

Here the error is on line 4. Bad argument #1 to 'draw' is referring to the first argument (`picture`) in the {% api "love.graphics.draw" %} call. LÖVE is saying it was expecting a {% api "Drawable" %} as the first argument but we gave it `nil` (or nothing). Of course in this case we did give it *something* so why are we getting this error?

A close look at the `picture` variable we're passing through makes it clear that we didn't actually define it anywhere. Instead we meant to pass the `image` variable!

```lua 4
local image = love.graphics.newImage("assets/whale.png")

function love.draw()
    love.graphics.draw(image, 100, 100)
end
```

Changing that line to instead pass through `image` and rerunning the code shows us a lovely picture of a whale instead of an error.

{% love %}
local image = love.graphics.newImage("assets/whale.png")

function love.draw()
    love.graphics.draw(image, 100, 100)
end
{% endlove %}

Hopefully you can see how even in a much bigger file or project you can quickly track down the source of an error and solve it.

## Traceback
What if the line the error message points you to isn't helpful? In the code below we're intentionally throwing an error on line 5 with an `assert` if a passed parameter is nil and that's indeed the line our error message is pointing to.

```lua
local image = love.graphics.newImage("assets/whale.png")
local whales = {}

local function make_whale(sprite)
    assert(sprite, "no sprite provided!")

    return {
        x = love.math.random(0, love.graphics.getWidth() - 96),
        y = love.math.random(0, love.graphics.getHeight() - 96),
        sprite = sprite
    }
end

function love.load()
    table.insert(whales, make_whale(image))
    table.insert(whales, make_whale(image))
    table.insert(whales, make_whale(image))
    table.insert(whales, make_whale(imaeg))
    table.insert(whales, make_whale(image))
end

function love.draw()
    for _, v in ipairs(whales) do
        love.graphics.draw(v.sprite, v.x, v.y)
    end
end
```

![](/assets/img/reading-errors/error_traceback.png)

But line 5 is our `assert`, it's not the direct cause of the bug and we're calling `make_whale` in many places. So how do we fix this and how do we know which `make_whale` call was the problematic one?

Well - below the error message there's a handy thing called a Traceback. This tells us what our program was doing just before it crashed! Starting from the bottom up this tells us the path of execution.

Starting from the top we can work our way back:

* `[love "callbacks.lua"]:245: in function 'handler'` - this isn't very helpful and we can ignore it
* `[C]: in function 'assert'` - this is our assert: the line that threw the error
* `main.lua:5: in function 'make_whale'` - this is where we called `assert`
* `main.lua:18: in function 'load'` - aha!

Our `make_whale` function was called from line 18 in main.lua's load function and that call was the one that directly led to the error being thrown. Looking back at our code we can see that line 18 looks a little different from the others with a typo: `make_whale(imaeg)` should be `make_whale(image)`!

{% love %}
local image = love.graphics.newImage("assets/whale.png")
local whales = {}

local function make_whale(sprite)
    assert(sprite, "no sprite provided!")

    return {
        x = love.math.random(0, love.graphics.getWidth() - 96),
        y = love.math.random(0, love.graphics.getHeight() - 96),
        sprite = sprite
    }
end

function love.load()
    table.insert(whales, make_whale(image))
    table.insert(whales, make_whale(image))
    table.insert(whales, make_whale(image))
    table.insert(whales, make_whale(image))
    table.insert(whales, make_whale(image))
end

function love.draw()
    for _, v in ipairs(whales) do
        love.graphics.draw(v.sprite, v.x, v.y)
    end
end
{% endlove %}