---
title: "Recap"
authors: [Sheepolution]
date: 2025-02-24
---

You have now learned the fundamentals of Lua.

You have learned about **variables** and their **types**.

```lua
local my_number = 10
local my_string = "hello"
local my_boolean = true
local my_table = {}
local my_function = function () return end
local my_nil = nil
```

You have learned about **functions**. How they can have **parameters**. How you can pass **arguments** when you <ins>call</ins> them. And how they can **return** a value.

```lua
local function helloAnimal(animal)
    return "Hello " .. animal
end

print(helloAnimal("whale"))
```

You have learned about **expressions**.

```lua
local higher_than = 9 > 4
local lower_than = 2 < 8
local equal_to = 5 == 5
local higher_than_or_equal_to = 8 >= 3
local higher_than_or_equal_to = 4 <= 4
```

> [!NOTE]
> To be more precise, these are also <ins>expressions</ins>. They all use a different type of **operators**. [Read more about expressions](https://www.lua.org/pil/contents.html#4).
> ```lua
> local arithmetic_operator = 5 * 7
> local relation_operator = 8 > 2
> local logical_operators = true and false
> local concatenation = "Hello " .. "world"l

You have learned about **control structures**.

```lua
if true then
    print("if-statement")
end

for i = 1, 10 do
    print("For-loop")
end

while true do
    print("While-loop")
    break
end

repeat
    print("Repeat-until loop")
until false
```

> [!NOTE]
> <ins>Control structure</ins> is a very technical term. Often we simply call them **statements** instead. [Read more about statements](https://www.lua.org/pil/contents.html#4).

And you have learned about **tables**, and the different ways you can use them.

Using tables as a **list**.

```lua
local my_list_table = {
    "item 1",
    "item 2",
    "item 3"
}

table.insert(my_list_table, "item 4")
my_list_table[5] = "item 5"

for index, value in ipairs(my_list_table) do
    print(index, value)
end
```

And using tables as an **object**.

```lua
local my_object_table = {
    property: 123
}

my_object_table["key"] = "whale"
my_object_table.dot = true

for key, value in pairs(my_object_table) do
    print(key, value)
end
```

## Fundamentals combined

In the demo below, we combine all the fundamentals we learned. We create a moving rectangle each time we press the left or right arrow key (make sure you click on it first). Based on the arrow key, it moves either left or right. 

> [!TIP]
> Don't be discouraged if you have trouble understanding the code below. Learning individual concepts is one thing, but learning how to use them combined is a challenge on its own. Reread the chapters, experiment with the demos, try to make things yourself, and dare to take the next step even if you feel like you're not ready. Because that's how you learn.

{% love 800, 200, true %}
-- We declare the local variable rectangles, and assign a table as its value.
local rectangeList = {}

-- We create the function createRectangle.
local function createRectangle(direction)

    -- We create a new local variable named rectangle.
    -- It won't be available outside of this function.
    local rectangle = {
        -- We make it an object, and give it these properties.
        x = 375,
        y = 20,
        width = 50,
        height = 120,
        -- This will be either "left" or "right",
        -- based on what is passed as argument.
        direction = direction
    }

    -- We return the rectangle
    return rectangle
end

function love.update()
    -- We loop through the list of rectangles
    for i, rectangle in ipairs(rectangeList) do
        -- Move the rectangle to the left or right based on its direction.
        if rectangle.direction == "left" then
            rectangle.x = rectangle.x - 1
        elseif rectangle.direction == "right" then
            rectangle.x = rectangle.x + 1
        end
    end
end

function love.draw()
    -- We loop through the list of rectangles
    for i, rectangle in ipairs(rectangeList) do
        -- Draw the rectangle using its properties.
        love.graphics.rectangle("fill", rectangle.x, rectangle.y,
            rectangle.width, rectangle.height)
    end
end

function love.keypressed(key)
    -- If the key pressed is not "left" and is not "right"...
    if key ~= "left" and key ~= "right" then
        -- Go out of this function.
        return
    end

    -- We are still here, so the key is either "left" or "right".
    -- Because of the 'return', we don't need to use an 'else'.

    -- Call createRectangle, and pass the key as argument.
    -- We add its returned value to the list of rectangles.
    table.insert(rectangeList, createRectangle(key))
end
{% endlove %}