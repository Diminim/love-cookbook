---
title: "Variables"
authors: [Sheepolution]
date: 2025-02-19
---

**Variables** are words that contain a value, like a number for example.

We can make a variable like so:

```lua
a = 10
```

We created the variable `a` and gave it the value `10`. We can see the value of a variable by printing it.

```lua
a = 10
print(a) -- Output: 10
```
> [!NOTE]
> When you create a variable, we call that a **declaration**.
> 
> When you give a variable a value, we call that an **assignment**.
>
> So we <ins>declared</ins> the variable `a` and <ins>assigned</ins> it the value `10`.

We can change the value of a variable, hence the name *variable*.

```lua
a = 10
print(a) -- Output: 10
a = 20
print(a) -- Output: 20
```

With numbers we can do arithmetics.

```lua
print(12 + 4) -- Output: 16
```

This means that, if a variable has a number as its value, we can do arithmetics with it.

```lua
a = 12
b = 4
print(a + b) -- Output: 16
print(a - b) -- Output: 8
print(a * b) -- Output: 48
print(a / b) -- Output: 3
print(a ^ b) -- Output: 20736
-- ^ is for exponentiation (12 * 12 * 12 * 12)
```

When we use a variable, there is no reference to the variable itself, only its value. In this code we change the values of `a` and `b`, but that does not affect the value of `c`. The value of `c` becomes `16`, and not `a + b`.

```lua
-- Tip: This way we can declare multiple variables on a single line.
a, b = 12, 4
c = a + b
a, b = 0, 0
print(c) -- Output: 16
```

## Strings

Besides numbers, we can also store text. In programming, text is called a **string** because it's a *string of characters*.

```lua
animal = "whale"
color = "blue"

-- By separating them with a comma we can print multiple values at once.
print("My favorite animal:", animal)
print("My favorite color:", color)
```

We can connect strings by using two dots. This is called *string concatenation*.

```lua
animal = "whale"
color = "blue"

print("The " .. animal .. " is " .. color .. ".")
-- Output: The whale is blue.
```

## nil

When a variable has no value, we say it is `nil`. We can also assign `nil` to a variable to remove its value.

```lua
print(test) -- Output: nil

test = 10
print(test) -- Output: 10

test = nil -- We assign nil to remove the value.
print(test) -- Output: nil
```

## Types

We have shown that variables can be a number, or a string, or no value at all. We call this the variable's **type**.

You can get the type of a variable by using `type`.

```lua
local a = 10
local animal = "whale"

print(type(a)) -- Output: number
print(type(animal)) -- Output: string
print(type(test)) -- Output: nil
```

## Naming variables

The word in which you store a value can be almost anything.

```lua
whale = 3
cOoKbOoK = 1040
asdfghjkl = 42
```

> [!NOTE]
> Lua doesn't care what you name your variables. Earlier we used the variables `width` and `height`, but we also could have called them `chocolate` and `apple`. Of course, you would want to use names that make sense for their usage.

Variables are case-sensitive. This means that when you have the same word, but with different casing, it's not treated as the same. 

```lua
-- These are three different variables, each with their own value.
whale = 3
WHALE = 10
wHaLe = 200
```

> [!IMPORTANT]
> There are a few rules when naming a variable.
> 1. The name may not start with a number
> ```lua
> test8 --Good
> te8st --Good
> 8test --Bad, error!
> ```
> 2. The only allowed special character is an underscore.
> ```lua
> my_variable -- Good
> my@variable -- Bad, error!
> my$variable -- Bad, error!
>```
> 3. It can't be a keyword. A keyword is a word that the programming language uses.
>
> Here is a list of all the Lua keywords:
> ```
> and       break     do        else      elseif
> end       false     for       function  if
> in        local     nil       not       or
> repeat    return    then      true      until     while
> ```
> Note that `print` is not a keyword. It is a standard variable. You want to avoid overriding these standard variables.
> ```lua
> print = "hello"
> a = 5
> print(a) -- Error!
> ```

## Local variables

{% abstract "Local variables are variables that are only available within the scope they are created." %}

By default, all variables are **global**. This means that they can be used everywhere in your project. That sounds like a good thing, but it can get messy when you have a big project with many variables.

Because of that, we often use **local** variables. We can create a local variable by putting the keyword `local` in front.

```lua
local a = 0
-- We can reassign a value to our local variable, and it will remain local.
a = 10

-- We can declare a local variable without assigning it a value right away.
local b
b = 20
```

Local variables are only accessible where they are declared. We call this its *scope*. In a later chapter you will learn more about scope, but in simple terms it means the *code block* it is in, or otherwise the file.

> [!TIP]
> Every time you see and `end`, then that is the end of a *code block*.

Because it is good practice, we will use local variables throughout this cookbook.

## Usage

By using variables we can keep track of a value. For example, your ammo can be a variable, and when you shoot we subtract from that value to keep track of how many bullets you have left.

Another great thing about variables is that when we use one in multiple places, we only need to change one value for it to be applied those place. In the code below we can change the `width` and `height` variables to change the width and height of all rectangles.

{% love 800, 200, true %}
local width, height

function love.load()
    width = 100
    height = 75
end

function love.draw()
    love.graphics.rectangle("fill", 10, 10, width, height)
    love.graphics.rectangle("fill", 130, 10, width, height)
    love.graphics.rectangle("fill", 250, 10, width, height)
    love.graphics.rectangle("fill", 370, 10, width, height)
end
{% endlove %}
