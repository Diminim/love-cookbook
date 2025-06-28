---
title: "Input"
authors: [Sheepolution]
date: 2025-06-25
---
{% abstract "LÖVE has API for input through keyboard, mouse and joystick." %}

What is a game without some interaction? Good thing LÖVE's API has various functions regarding input.

Input can be separated into three categories:

* Keyboard
* Mouse
* Joystick

## Keyboard

With input we generally want to know three things:

* If a key is being held down
* The moment a key was pressed
* The moment a key was released

### isDown

To check if a key is being hold down we use {% api "love.keyboard.isDown(key)" %}.

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


The function accepts multiple arguments, so you can check if any of a list of keys is down.

```lua 2
function love.update()
    if love.keyboard.isDown("right", "d", "l") then
        x = x + 1
    elseif x > 0 then
        x = x - 1
    end
end
```

If we want to check if multiple keys are down at the same time we call the function twice and use `and`.

```lua 2
function love.update()
    if love.keyboard.isDown("right") and love.keyboard.isDown("lshift") then
        x = x + 1
    elseif x > 0 then
        x = x - 1
    end
end
```

`"lshift"` in the example above refers to the left shift button. Check out the {% api "KeyConstant" %} page for a list of all the keys.


### pressed / released

Pressing and releasing a key are *events*, and to capture such events we use a [callback](../lua-basics/functions#callbacks). In this case the callbacks {% api "love.keypressed" %} and {% api "love.keyreleased" %}.

{% love 100, 100, true %}
local score = 0

function love.draw()
    love.graphics.print(score, 42, 40)
end

function love.keypressed(key)
    if key == "up" then
        score = score + 1
    end
end

function love.keyreleased(key)
    if key == "down" then
        score = score - 1
    end
end
{% endlove %}

A problem with this is that our code can become very detached. What if deep inside our update function we want to know if a key was pressed? We can make a simple function to help with this.

> [!TIP]
> You can also consider using an input library like [baton](https://github.com/tesselode/baton).


{% love 100, 100, true %}
local score = 0
local keysPressed = {}

local function wasPressed(key)
    return keysPressed[key]
end

function love.update(dt)
    if wasPressed("space") then
        score = score + 1
    end

    -- Reset the list of pressed keys.
    keysPressed = {}
end

function love.draw()
    love.graphics.print(score, 42, 40)
end

function love.keypressed(key)
    keysPressed[key] = true
end
{% endlove %}

### textinput

If you have a game where you can enter your name, it would be troublesome to use {% api "love.keypressed" %} for it. You'd have to check if shift is being held down to decide whether the entered key is uppercase or not, for example.

Luckily, LÖVE also has the callback {% api "love.textinput" %}. If the user used the combination that would type the dollar sign, then the text we get is the dollar sign.

{% love 300, 100, true %}
local name = ""

function love.draw()
    love.graphics.print("Your name: " .. name, 10, 40)
end

function love.textinput(text)
    name = name .. text
end

function love.keypressed(key)
    if key == "backspace" then
        name = name:sub(0, -2)
    end
end
{% endlove %}

## Mouse

The mouse input API is very similar to that of the keyboard:

* {% api "love.mouse.isDown(key)" %}
* {% api "love.keypressed" %}
* {% api "love.keyreleased" %}

But instead of a string, we pass a number:

* `1` is the primary mouse button (probably left-click).
* `2` is the secondary mouse button (probably right-click)
* `3` is the middle mouse button.
* Further buttons are mouse dependent (e.g. some mice have buttons on the side).

The mouse also has a position on the screen, which is passed along with the callbacks.

{% love 300, 300, true %}
local circle = {
    x = 100,
    y = 100,
}

function love.draw()
    love.graphics.circle("fill", circle.x, circle.y, 20)
end

function love.mousepressed(x, y, button)
    if button == 1 then
        circle.x = x
        circle.y = y
    end
end
{% endlove %}

We can also use {% api "love.mousemoved" %} to get the new position each time the mouse moved, or {% api "love.mouse.getPosition" %} to always get the current position of the mouse.

With the callback {% api "love.wheelmoved" %} we capture the event of the mouse wheel being used. A positive value indicates upwards movement.

{% love 300, 300, true %}
local radius = 10

function love.draw()
    local x, y = love.mouse.getPosition()
    love.graphics.circle("fill", x, y, radius)
end

function love.wheelmoved(x, y)
    if y > 0 then
        radius = radius + 3
    elseif y < 0 then
        radius = radius - 3
    end
end
{% endlove %}

## Joystick

For controller input we use {% api "love.joystick" %}. With the function {% api "love.joystick.getJoysticks()" %} we get all the connected joysticks.

A *joystick* is any type of controller, like an Xbox controller or a PlayStation controller, but also a dance pad or a Wii Fit Balance Board. A standard controller, like the first two, are considered <ins>gamepads</ins>. These are joysticks who's buttons can be mapped to a common layout.

![](/assets/img/input/360_controller.png)

> [!NOTE]
> Following the pattern in the image above, the A button refers to the bottom button of the four *face buttons*. This means that `"a"` refers to the X button on a PlayStation controller, and `"x"` refers to the square button. Check out the {% api "GamepadButton" %} page for all gamepad buttons. 


In this section we will focus on gamepads. We can check if a joystick is a gamepad by using {% api "Joystick:isGamepad()" %}.

Again, the gamepad input API follows a similar pattern:

* {% api "joystick:isGamepadDown(button)" %}
* {% api "love.gamepadpressed" %}
* {% api "love.gamepadreleased" %}

If we want to check if player 2 is holding down the A button, we can use {% api "Joystick:getID()" %} to check from which player the joystick is.

```lua
function love.update(dt)
    local joysticks = love.joystick.getJoysticks()

    for i=1, #joysticks do
        local id = joystick[i]:getID()
        if id == 2 then
            if joystick:isGamepadDown("a") then -- If not a gamepad, it will return false.
                print("Player 2 is holding down A!")
            end
        end
    end
end
```

With {% api "love.gamepadpressed" %} and {% api "love.gamepadreleased" %} we get the joystick that pressed it, along with the pressed button.

```lua
function love.gamepadpressed(joystick, button)
    print("Player " .. joystick:getID() .. " pressed the button " .. button)
end

function love.gamepadreleased(joystick, button)
    print("Player " .. joystick:getID() .. " released the button " .. button)
end
```

### Axes

Besides buttons, a gamepad also has control sticks and triggers. These have more than a pressed/non-pressed state, as you can move the control stick slightly to the right, or hold down the right trigger halfway.

The axes can be accessed using {% api "Joystick:getGamepadAxis(axis)" %}. 

The `axis` argument needs to be a string.
* `"leftx"` - The x-axis of the left thumbstick.
* `"lefty"` - The y-axis of the left thumbstick.
* `"rightx"` -  The x-axis of the right thumbstick.
* `"righty"` -  The y-axis of the right thumbstick.
* `"triggerleft"` - Left analog trigger.
* `"triggerright"` - Right analog trigger.

```lua
function love.update(dt)
    local joysticks = love.joystick.getJoysticks()
    local player1 = joysticks[1]

    local x = player1:getGamepadAxis("leftx")
    local y = player1:getGamepadAxis("lefty")
    if x > 0.5 and y < 0.5 then
        print("Holding the left control stick in the upper right corner.")
    end

    local rightTrigger = player1:getGamepadAxis("triggerright")
    if rightTrigger > 0.3 then
        print("Slightly holding down the right trigger")
    end
end
```

> [!WARNING]
> With some controllers the control stick is never perfectly in the center. Take this into account when using axes, by using a threshold.
> ```lua
> local x = player1:getGamepadAxis("rightx")
>  
> if x > 0 then
>     -- Value could be something like 0.01
>     print("Holding right apparently?")
> end
>
> if x > 0.2 then
>     print("Definitely holding right! (Though slightly)")
> end
> ```


The change in axis also has a callback: {% api "love.gamepadaxis" %}.

```lua
function love.gamepadaxis(joystick, axis, value)
    if joystick:getID() == 3 then
        if axis == "lefttrigger" then
            if value > 0.5 then
                print("The left trigger of player 3 is pressed halfway.")
            end
        end
    end
end
```

### Rumble

Most modern controllers support rumble. We can set the rumble using {% api "Joystick:setVibration(left, right)" %}. You can set the vibration of the left and right motor seperately, but generally you'd want these to be the same.

```lua
function love.gamepadpressed(joystick, button)
    if button == "a" then
        joystick:setVibration(.5, .5) -- Vibrate on half strength.
    end

    if button == "b" then
        joystick:setVibration(1, 1, 3) -- Vibrate on full strength for 3 seconds.
    end
end

function love.gamepadreleased(joystick, button)
    if button == "a" then
        joystick:setVibration() -- Stop vibrating.
    end
end
```