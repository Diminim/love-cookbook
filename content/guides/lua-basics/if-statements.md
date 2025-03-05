---
title: "If-statements"
authors: [Sheepolution]
date: 2025-02-20
---
{% abstract "if-statements are great!" %}

With **if-statements** we can control whether certain code should be executed or not.

```lua
if true then
    print("Hello world") -- Will get printed
end

if false then
    print("Bye world") -- Will not get printed
end
```

`true` and `false` are a type of value called **boolean**. What is inside the if-statement is only executed if the boolean provided is `true`. The provided boolean is called the <ins>condition</ins>.

Because a boolean is a type of value, we can assign it to a variable.

```lua
local a = true
```

We can use the keyword `else` to decide what should happen when the condition is not met.

```lua
if false then
    print("Bye world!") -- Will not get printed
else
    print("Oh, still here!") -- Will get printed
end
```

And we can use the keyword `elseif` to chain multiple if-statements.

```lua
local a, b, c = false, false, true

if a then
    print("a?") -- Not printed
elseif b then
    print("b?") -- Not printed
elseif c then
    print("c!") -- Printed!
else
    print("Nothing...") -- Not printed
end
```

## Expressions

We can also assign a boolean by using an **expression**.

```lua
local a = 5 > 9
```

Here, the value of `a` becomes whether the expression `5 > 9` is `true` or `false`. The character `>` means *higher than*. 5 is not higher than 9, so `a` becomes `false`.

```lua
local a = 5 > 9 -- false

if a then
    print("5 is higher than 9") -- Not printed
end
```

> [!NOTE]
> An if-statement is what we call a **control structure**.
>
> `5 > 9` is an **expression**.
>
> `a` is used as the **condition** for the if-statement.

To check whether two values are the same, we use two equal signs.

```lua
if 3 == 7 then
    print("3 is equal to 7") -- Not printed
end
```

> [!IMPORTANT]
> One equal sign is for assignment.
>
> Two equal signs is for comparing.
> ```lua
> a = 10 -- An assignment, a becomes 10.
> a == 10 -- An expression, whether a equals 10.
> ```

We can combine `>` and `<` with `==` to create `>=` and `<=`.
```lua
print(4 > 4) -- false, 4 is not higher than 4.
print(4 < 4) -- false, 4 is not lower than 4.

print(4 >= 4) -- true, 4 is equal to or higher than 4.
print(4 <= 4) -- true, 4 is equal to or lower than 4.
```

And finally, we have `~=` to check if two values are NOT equal to each other.

```lua
print(4 == 4) -- true, 4 is equal to four.
print(4 ~= 4) -- false, 4 IS equal to four.
```

> [!NOTE]
> One more time:
> * `a == b`- Whether `a` is equal to `b`.
> * `a ~= b` - Whether `a` is <ins>not</ins> equal to `b`.
> * `a > b` - Whether `a` is higher than `b`.
> * `a < b` - Whether `a` is lower than `b`.
> * `a >​= b` - Whether `a` is higher than or equal to `b`.
> * `a <​= b` - Whether `a` is lower than or equal to `b`.

We can use the keyword `not` to check if a value is **not** true.


```lua
local a = 5 == 8

if not a then
    print("5 is NOT equal to 8") -- Printed!
end
```

Once inside an if-statement, it doesn't matter what happens to the variable that was used as a condition. Besides, the condition is not the variable itself, but the value it holds.

```lua
local a = true

if a then
    a = false
    print("Hello world!") -- Printed!
end
```

> [!TIP]
> A common <ins>mistake</ins> beginners make is to do the following:
> ```lua
> if a == true then
> ```
> Though not incorrect, it is redundant. We don't need to compare `a` with the value `true`, because `a` by itself is already `true` or `false`. It would be the same as doing `true == true`.

## and & or

{% abstract "With the keyword `and` we can combine expressions to check if they are all true. With the keyword `or` we can combine expressions to check if any of them are true." %}

With the keyword `and` we can combine expressions to check if they are all true.

```lua
if 5 < 9 and 7 > 3 then
    print("Both expressions are true") -- Printed!
end

if 6 > 1 and 5 == 4 and 8 > 2 then
    print("All these expressions are true") -- Not printed
end
```

With the keyword `or` we can combine expressions to check if any of them are true.

```lua
if 1 > 8 or 7 > 3 then
    print("Any of these two expressions is true") -- Printed!
end

if 6 > 1 or 5 == 4 or 8 > 2 then
    print("Any of these expressions is true") -- Printed!
end
```

We can also combine `and` & `or`. We can use parantheses to group these expressions. The placement of parantheses can change whether an expression is `true` or `false`. Can you figure out why the first statement gets printed, but the second one does not?

```lua
if 8 < 4 and 7 == 3 or 2 < 6 then
    print("Printed!")
end

if b = 8 < 4 and (7 == 3 or 2 < 6) then
    print("Not printed...")
end
```

## Truthy and falsy

{% abstract "Truthy and falsy refer to state of values when used as a condition. The values `false` and `nil` are falsy. All other values are truthy." %}

So far we have talked about booleans, and `true` or `false`, but if-statements can accept other values as well. We call these values **truthy**.

```lua
if 15 then
    print("Fifteen!")
end
```

The only two values that if-statements see as false are `false` and `nil`. We call these values **falsy**.

```lua
if true then print(1) end -- Printed!
if false then print(2) end -- Not printed
if nil then print(3) end -- not printed
if 4 then print(4) end -- Printed!
if "hello" then print(5) end -- Printed!
-- Output: 1, 4, 5
```

A function is also a type of value, and is also truthy. Unless you call the function, and it returns `false` or `nil`.

```lua
local function hello()
    return false
end

if hello then -- The function by itself is truthy.
    print("hello is truthy!") -- Printed!
end

if hello() then -- The function call returns false.
    print("Not printed...")
else
    print("hello() is falsy!") -- Printed!
end
```

## Nested statements

{% abstract "A nested statement is when you put a statement (like an if-statement or a for-loop) inside another statement" %}

We can put an if-statement inside another if-statement. We call these **nested statements**.

```lua
local number = 80

if number > 50 then
    if number > 75 then
        if number > 100 then
            print("Higher than 100!")
        else
            print("Lower than 100") -- Printed!
        end
    else
        print("Lower than 75")
    end
else
    print("Lower than 50")
end
```

## Usage

By using if-statements, we can prevent code from being executed. For example, if you have an `ammo` variable, we can use the expression `ammo > 0` to check whether the player still has bullets left.

```lua
if ammo > 0 then
    shoot()
    ammo = ammo - 1
end
```

In the demo below, we use an if-statement to stop a rectangle from moving as it touches the edge.

```lua
local x = 0

function love.update()
    if x < 700 then
        x = x + 1
    end
end

function love.draw()
    love.graphics.rectangle("fill", x, 50, 100, 100)
end
```

{% love 800, 200 %}
local frame = 0
local x = 0

function love.update()
    frame = frame + 1

    if x < 700 then
        x = x + 1
    end

    if frame > 1000 then
        frame = 0
        x = 0
    end
end

function love.draw()
    love.graphics.rectangle("fill", x, 50, 100, 100)
end
{% endlove %}

And in this demo, the square only moves to the right when holding down the right arrow key. If not, it will move to the left, as long as the value of `x` is higher than `0`.

{% love 800, 200, true %}
local x = 0

function love.update()
    if love.keyboard.isDown("right") then
        x = x + 1
    elseif x > 0 then
        x = x - 1
    end
end

function love.draw()
    love.graphics.rectangle("fill", x, 50, 100, 100)
end
{% endlove %}

> [!TIP]
> These demos are simplified. Check out the chapter on deltatime for proper movement.
