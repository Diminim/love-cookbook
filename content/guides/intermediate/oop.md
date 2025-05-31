---
title: "OOP"
authors: [ellraiser]
date: 2025-05-21
description: "An introduction to OOP programming with LÖVE"
---

OOP is not just something you say when your code breaks, it stands for "Object-Oriented Programming", and is a way of organising your code.  
It is one of two popular routes in many languages when designing games, the other being ECS - "Entity-Component-System".

In this chapter we"ll cover some basics around OOP and some ways to implement this in Lua, as well as work towards a larger example game!
It's worth noting there are lots of different ways this can be achieved, and what is shown here is just one example.

## Approach
The general idea for OOP is to break down the game into different "objects" (called classes), each with their own self-contained properties and logic required for their function.  
In this example we'll be working on making a classic arcade game - Asteroids.  

If you break down the elements of Asteroids, there's (at least) 3 main objects that everything falls into:
* Player/Ship - The player ship has a position, health, it can move, rotate, and fire bullets.
* Asteroid - The asteroids has a position, it can move, be destroyed, and split into other asteroids.
* Bullet - Bullets are fired from the player, they have a position, angle, speed and can destroy asteroids.

An example object for each of those could look like:
```lua
local player = {
  x = 10,
  y = 16,
  hp = 400,
  move = function() end,
  fire = function() end
}

local asteroid = {
  x = 30,
  y = 42,
  size = 50,
  move = function() end,
  destroy = function() end
}

local bullet = {
  x = 10,
  y = 16,
  angle = 40,
  speed = 100,
  collide = function() end
}
```

Each class is a template for every instance of that type - every asteroid is going to have the same properties and methods, as they all get created from the same class.

By using an OOP approach, you might find it easier to break down your game into these different "templates", as well as help you keep logic in the right place - finding something related to player movement will be in the player object file, making it easy to keep track of.

You can also rely on certain things based on the type of object - you know all asteroids have a size property, you know all bullets have a collide method etc.

While some languages provide classes "out the box", Lua doesn't directly - but by using [metatables](../lua-intermediate/metatables) we can create some systems to allow us to implement a robust OOP system.

## Creating Objects
In Lua, your "objects" are just going to be your standard [tables](../lua-basics/tables), with their properties and their functions inside them.

Consider the following bad code, we'll explain why it's "bad" in a moment:
```lua
-- asteroid "class"
function newAsteroid(x, y, angle)
  -- new asteroid table
  local inst = {
    x = x,
    y = y,
    angle = math.rad(angle),
    speed = 10,
    size = 10,
    -- update script
    update = function(self)
      self.x = self.x + (math.cos(self.angle) * self.speed)
      self.y = self.y + (math.sin(self.angle) * self.speed)
    end,
    -- draw script
    draw = function(self)
      love.graphics.circle("fill", self.x, self.y, self.size)
    end
  }
  return inst
end

-- make some asteroids
local asteroids = {}
for a=1,10 do
  table.insert(asteroids, newAsteroid(love.math.random(0, 100), love.math.random(0, 100), love.math.random(0, 360)))
end
```

So we have a function moonlighting as a "class" that makes a new asteroid, defining some basic properties, and an update and a draw script.  
We then call this 10 times, creating an asteroid instance somewhere in a 100x100px area, with a random initial angle in any direction.

This seems like it would work fine (and technically it would), however it means that for each asteroid we're making new anonymous functions for both "update" and "draw" every single time.  
In our loop we've created 20 new functions while making our asteroids!

These functions are the same for every single asteroid, so really they should all use the "same" function.

## Basic Classes
To make things more efficient, we should have one object table "class", and all instances of that object should use that same "template" for their functions and logic.

This is where metatables come in, consider this bad boy:
```lua
-- asteroid class
local asteroid = {
  new = function(self, x, y, angle)
    -- new asteroid table
    local inst = {
      x = x,
      y = y,
      angle = math.rad(angle),
      speed = 10,
      size = 10,
    }
    -- the two magic lines
    setmetatable(inst, self)
    self.__index = self
    --
    return inst
  end,
  -- update script
  update = function(self)
    self.x = self.x + (math.cos(self.angle) * self.speed)
    self.y = self.y + (math.sin(self.angle) * self.speed)
  end,
  -- draw script
  draw = function(self)
    love.graphics.circle("fill", self.x, self.y, self.size)
  end,
  -- destroy script
  destroy = function(self)
    print("boom!")
  end
}

-- make some asteroids
local asteroids = {}
for a=1,10 do
  table.insert(asteroids, asteroid:new(love.math.random(0, 100), love.math.random(0, 100), love.math.random(0, 360)))
end
```

Some new stuff to notice here - first we've changed our asteroid class definition from being just a function that returns a table to being an actual table with a `new` method.  
This allows us to create new instances of the object with `asteroid:new`, the `:` syntax passing the `asteroid` table as the first parameter, `self`.  

We then a magic lines which give us the basis of our OOP in Lua:
```lua
setmetatable(inst, self)
self.__index = self
```

These lines are doing two things - first as you learnt in [metatables](../lua-intermediate/metatables), we're setting the metatable of our `inst` to be the `asteroid` table.  
This means that any metamethods defined for `asteroid`, such as `__newindex` or `__index`, will be inherited by the `inst` table.

The second line sets the `__index` metamethod to the `asteroid` table itself, which essentially means all the methods on the `asteroid` table will now be available on our `inst` table - acting as a template! 

```lua
local inst = asteroid:new(10, 10, 50)
print(asteroid.destroy, inst.destroy) -- will print matching table references
inst:destroy() -- will print "boom!"
```

> [!NOTE]
> If you"re interested on how the two magic lines actually work, consider an example flow:
> 1. We want to call `inst:destroy()`
> 2. First the system will check for an `inst.destroy` property to call - but it doesn't exist
> 3. Then the system checks for a `inst.__index` metamethod
> 4. Because we used `setmetatable`, our `inst.__index` is the same as `asteroid.__index`
> 5. `asteroid.__index` is pointing at itself, the `asteroid` table
> 6. The system will now check for an `asteroid.destroy` property to call - it finds one!
> 7. The system calls `asteroid.destroy` passing the `inst` as the `self` parameter

## Alternative Structures

You might realise that we don't actually have to call `self.__index = self` in the `new` function above, as technically after the first instance is created this line is obsolete because we've already set `asteroid.__index` to `asteroid` once.

Something like this would work just as well:
```lua
-- another asteroid class
local asteroid = {
  new = function(self, x, y, angle)
    -- new asteroid table
    local inst = {
      x = x,
      y = y,
      angle = math.rad(angle),
      speed = 10,
      size = 10,
    }
    -- the two magic lines
    setmetatable(inst, self)
    return inst
  end,
  -- destroy script
  destroy = function(self)
    print("boom!")
  end
}
-- set __index for the table
asteroid.__index = asteroid
```

Having it dumped at the bottom of your class file can be a bit awkward and you might forget to add it though, which is why it normally gets tidied away into the `new` method.

You could also define your class like this, breaking each definition out:
```lua
-- yet another asteroid class
local asteroid = {}
-- set __index here
asteroid.__index = asteroid
-- create script
asteroid.new = function(self, x, y, angle)
  -- new asteroid table
  local inst = {
    x = x,
    y = y,
    angle = math.rad(angle),
    speed = 10,
    size = 10,
  }
  setmetatable(inst, self)
  return inst
end
-- destroy script
asteroid.destroy = function(self)
  print("boom!")
end
```

Both approaches work exactly the same, it's just different styles based on your own preference and how you like to write your code!

Now we have a basic class stucture, let's look at extended them!

## Extended Objects
There's a few different ways you could 'extend' a class to inherit the base properties and logic and then add to it or override it in an extended class.  
They all have to deal with the problem of `setmetatable` only being able to set one table, not multiple.

Once option you could do is simply add to or override methods in the extended class in it's `new` call:
```lua
-- basic asteroid class
local asteroid = {
  new = function(self, x, y, size)
    local inst = {
      x = x,
      y = y,
      size = size
    }
    setmetatable(inst, self)
    self.__index = self
    return inst
  end,
  destroy = function(self)
    print('boom!')
  end
}

-- extended planet class
local planet = {
  new = function(self, x, y)
    local inst = asteroid:new(x, y, 1000)
    inst.destroy = self.destroy -- overwrite destroy script
    inst.reposition = self.reposition -- add a new script
    return inst
  end,
  destroy = function(self)
    print('bigger boom!')
  end,
  reposition = function(self, x, y)
    self.x = x
    self.y = y
  end
}

-- planet will have same properties as asteroid, plus script changes
local inst = planet:new(10, 10)
inst:destroy() -- prints 'bigger boom!'
inst:reposition(20, 20)
print(inst.x) -- 20
```

This is fine, but having to define new methods in `new` might lead you to forgetting to update new scripts you add later - if you add another script to the `planet` table but don't define it in the `new` method then you won't be able to call it.

You could instead do something like:
```lua
local planet = {
  new = function(self, x, y)
    local inst = asteroid:new(x, y, 1000)
    for key, value in pairs(self) do
      inst[key] = value
    end
    return inst
  end,
  destroy = function(self)
    print('bigger boom!')
  end,
}
```
This would make sure any keys defined on the `planet` table would get added to all planet instances, and they'd still be a reference not a copy.

If you want to melt your brain thinking about `__index` references and prefer the more definition led structure shown earlier, you could also do:
```lua
-- asteroid class
local asteroid = {}
asteroid.new = function(self, x, y, size)
  local inst = {
    x = x,
    y = y,
    size = size
  }
  setmetatable(inst, self)
  self.__index = self -- note we're purposely setting __index here
  return inst
end
asteroid.split = function(self)
  for a=1,3 do
    asteroid:new(self.x, self.y, self.size/2)
  end
  print('split!')
end
asteroid.destroy = function(self)
  print('boom!')
end

-- planet class
local planet = asteroid:new(0, 0, 1000)
planet.destroy = function(self)
  print('bigger boom!')
end

-- check it all works!
local inst = planet:new(10, 10)
inst:destroy() -- prints 'bigger boom!'
inst:split() -- prints 'split!', still works!
```

In this version, we're defining the `asteroid` class as normal, but for the `planet` class, we first make a new instance of the `asteroid` to use AS our class.  
This means when we call `planet:new()` we're passing in the `planet` table as the reference for the metatable, but because we created it initially as an instance of `asteroid` we have all the existing methods too.

A limitation of this route is not having an initial `new` function for the `planet` class, which might restrict you.

You can see a more advanced example with rxi's [classic](https://github.com/rxi/classic/blob/master/classic.lua), which is small bit of code that lets you create classes, extend them, and also use 'mixins', which are essentially some predefined set of functions that you can then add to a class.  

You should be able to make sense of the code after what you've learned here and in the [metatables](../lua-intermediate/metatables) page, or maybe try using it to build your own class system!  
For example, you have your Player, Asteroid, and Bullet class. All 3 have an 'x' and a 'y' and a 'direction' and a 'speed' - you could make some sort of generic 'Object' class and all 3 classes are extensions of that. 

As it stands it isn't that useful to do, as it's just saving you writing out those four keys 3 times, but if you had some generic methods like a `destroy` or some default drawing code, then it might make sense to do so. You could even play with having some common 'event' hooks that your base class implements, that you can then define in your extended classes.

```lua
local object = {}
object.__index = object
object.new = function(self, x, y, dir, speed)
  local inst = {
    x = x,
    y = y,
    dir = dir,
    speed = speed,
    destroy_script = nil
  }
  setmetatable(inst, self)
  return inst
end
-- when object:destroy() is called check for a destroy_script
-- call that first if we have one
object.destroy = function(self)
  if self.destroy_script then self:destroy_script() end
  print('some default cleanup here!')
end

local asteroid = object:new(0, 0, 0, 10)
asteroid.size = 100
-- define the custom destroy script to run on destroy
asteroid.destroy_script = function(self)
  for a=1,3 do
    asteroid:new(self.x, self.y, self.size/2)
  end
  print('split!')
end

-- call destroy, which in turn now calls our destroy_script as well
asteroid:destroy()
```

## Event Hooks
With what we just looked at, you can see how you could have a way of setting up your own hooks, but what about the standard love hooks?

Doing this is pretty easy, all you'd need to do is standardise the naming for the various event scripts across all your classes - if you make sure all asteroids and the player and bullets have an 'update' script and a 'draw' script, we can add all these objects into a big table and iterate over that inside the main love hooks.

```lua
-- a list of objects to easily iterate over all instances
local all_asteroids = {}

-- asteroid class
local asteroid = {
  new = function(self, x, y, angle)
    -- new asteroid table
    local inst = {
      x = x,
      y = y,
      angle = math.rad(angle),
      speed = 10,
      size = 10,
    }
    setmetatable(inst, self)
    self.__index = self
    table.insert(all_asteroids, inst)
    return inst
  end,
  -- update script
  update = function(self, dt)
    self.x = self.x + (math.cos(self.angle) * self.speed * dt)
    self.y = self.y + (math.sin(self.angle) * self.speed * dt)
  end
}

-- now in the love.update hook we can simply iterate through all objects
love.update = function(dt)
  for a=1,#all_asteroids do
    -- all asteroids will have an update script, now called every frame
    all_asteroids[a]:update(dt)
  end
end
```

In this way you could set up hooks for all the main events, `update`, `mousepressed`, `keypressed`, `draw`, and then let each of the objects handle their own logic when any of these events are called. Combine this with your own custom hooks, like say a `destroy` or a `gameover`, and you'll be able to have some complex logic without losing track of where everything is.

## Overcomplicating
When making a game with OOP, it's worth remembering that not every single thing has to fall under an object, and you do not always need to keep making more abstracted and 'simpler' objects - this can end up making things messier. OOP is a general approach to structuring the architecture of your game and helping you plan things out, but it doesn't have to be completely strict.

In the example above we looked at making a generic class for all 3 classes to use. However say you had a 4th class, like a UI Button, that only had an 'x' and a 'y' - would you make an even more abstracted class with just an 'x' and a 'y' that the 'Object' itself extends? Probably not, where does it end! A class for just the 'x' property??? (don't do this)

In the other direction, there will be things that don't quite fall inside one specific type of object - main menus, saving the game, incrementing score, drawing GUI, playing music etc. You might be tempted to just make one big 'Controller' object (a "god object") that handles all of this larger logic, which is fine but it's very easy for this to snowball into a large and unwieldy file.

The idea of a controller object is good though, you just might want to split that out into a few different ones, a central one for game states, one for audio, one for cutscenes. It also might be better to just have a few 'module' files, for common utility scripts - it doesn't have to be an object for every single function, and sometimes a function might make more sense sitting outside of objects.

## Asteroids!
Here's one final example, using all the stuff just mentioned as well as everything else we've covered in this chapter to take a basic stab at creating Asteroids!

We have a helper 'module' to store some reused scripts across classes, an asteroid class, a bullet class, and a player class.  
We create a player, and a bunch of asteroids, and then use event hooks to automatically update and draw our objects.

Using "W" we can move forward, and use "A" and "D" to turn. Clicking with the mouse will fire a bullet that 'destroys' an asteroid!  
You will flash red when you are 'hit' by an asteroid.

```lua
-- a list of objects to easily iterate over all instances
local all_objects = {}

-- helper/utility 'module'
-- we use these methods in both classes, so makes sense to sit outside the objects
local helper = {
  -- set x delta using angle
  calculateVX = function(value, angle, speed)
    return value + (math.cos(angle) * speed)
  end,
  -- set y delta using angle
  calculateVY = function(value, angle, speed)
    return value + (math.sin(angle) * speed)
  end,
  -- check if an obj is colliding with a specific 'type' of object in the list
  checkCollision = function(obj, type)
    for o=1,#all_objects do
      local other = all_objects[o]
      if other ~= obj and other.type == type and not other.destroyed
      and obj.x >= other.x and obj.x <= other.x+16
      and obj.y >= other.y and obj.y <= other.y+16 then
        return other
      end
    end
    return nil
  end
}

-- asteroid class
local asteroid = {
  new = function(self, x, y)
    -- new asteroid table
    local inst = {
      x = x,
      y = y,
      angle = math.rad(love.math.random(0, 360)),
      speed = love.math.random(1, 10)/10,
      destroyed = false,
      type = 'asteroid'
    }
    setmetatable(inst, self)
    self.__index = self
    table.insert(all_objects, inst)
    return inst
  end,
  -- update script
  update = function(self)
    if self.destroyed then return nil end
    self.x = helper.calculateVX(self.x, self.angle, self.speed)
    self.y = helper.calculateVY(self.y, self.angle, self.speed)
    -- bounce at edges of screen
    if self.x < 0 or self.y < 0 or self.x > 800 or self.y > 600 then
      self.angle = self.angle * -1
    end
  end,
  -- draw script
  draw = function(self)
    if self.destroyed then return nil end
    love.graphics.setColor(0, 1, 1)
    love.graphics.rectangle('line', self.x, self.y, 16, 16)
  end,
  -- destroy script
  destroy = function(self)
    self.destroyed = true -- a 'fake' destroy, it's still in the list!
  end
}

-- bullet class
local bullet = {
  new = function(self, x, y, angle)
    local inst = {
      x = x,
      y = y,
      angle = angle,
      speed = 5,
      collided = false,
      destroyed = false,
      type = 'bullet'
    }
    setmetatable(inst, self)
    self.__index = self
    table.insert(all_objects, inst)
    return inst
  end,
  -- update script
  update = function(self, dt)
    if self.destroyed then return nil end
    self.x = helper.calculateVX(self.x, self.angle, self.speed)
    self.y = helper.calculateVY(self.y, self.angle, self.speed)
    -- check if colliding with asteroid
    local hit = helper.checkCollision(self, 'asteroid')
    if hit then
      hit:destroy()
      self:destroy()
    end
  end,
  -- draw script
  draw = function(self)
    if self.destroyed then return nil end
    love.graphics.setColor(1, 1, 0, 1)
    love.graphics.circle('fill', self.x, self.y, 2)
    love.graphics.setColor(1, 1, 1, 1)
  end,
  -- destroy script
  destroy = function(self)
    self.destroyed = true -- a 'fake' destroy, it's still in the list!
  end
}

-- player class
local player = {
  new = function(self, x, y, angle)
    local inst = {
      x = x,
      y = y,
      angle = math.rad(angle),
      speed = 150,
      hp = 100,
      collided = false,
      spr = love.graphics.newCanvas(16, 16),
      type = 'player'
    }
    -- @TEMP 
    -- this is just to draw a 'fake' sprite instead of using a texture+quad
    love.graphics.setCanvas(inst.spr)
      love.graphics.polygon('fill', 0,0, 16,8, 0,16)
    love.graphics.setCanvas()
    -- @TEMP
    setmetatable(inst, self)
    self.__index = self
    table.insert(all_objects, inst)
    return inst
  end,
  -- update script
  update = function(self, dt)
    local speed = 0
    -- a + d to change angle, w + s to move forward + backward
    if love.keyboard.isDown('a') then self.angle = self.angle + (-3 * dt) end
    if love.keyboard.isDown('d') then self.angle = self.angle + (3 * dt) end
    if love.keyboard.isDown('w') then speed = self.speed * dt end
    -- reuse the helper scripts
    self.x = helper.calculateVX(self.x, self.angle, speed)
    self.y = helper.calculateVY(self.y, self.angle, speed)
    -- see if we hit something!
    self.collided = helper.checkCollision(self, 'asteroid') ~= nil
  end,
  -- draw script
  draw = function(self)
    if self.collided then
      love.graphics.setColor(1, 0, 0, 1)
    else
      love.graphics.setColor(1, 1, 1, 1)
    end
    love.graphics.draw(self.spr, self.x, self.y, self.angle, 1, 1, 8, 8)
    love.graphics.setColor(1, 1, 1, 1)
  end,
  -- mousepress
  mousepressed = function(self)
    bullet:new(self.x, self.y, self.angle)
  end
}

-- load game
love.load = function()
  -- make a player
  local p = player:new(10, 10, 20)
  -- make some asteroids
  for a=1,30 do
    asteroid:new(love.math.random(0, 800), love.math.random(0, 600))
  end
end

-- love events
-- for all objects, check if there's an event script defined, then call it if so
love.update = function(dt)
  for o=1,#all_objects do
    if all_objects[o].update then all_objects[o]:update(dt) end
  end
end
love.draw = function()
  for o=1,#all_objects do
    if all_objects[o].draw then all_objects[o]:draw() end
  end
end
love.mousepressed = function()
  for o=1,#all_objects do
    if all_objects[o].mousepressed then all_objects[o]:mousepressed() end
  end
end
```

Want some homework? Why not try taking this example and expand it further! 
Here's some ideas for you:
* Right now the player just flashes when they get hit, but what about taking damage? 
* If the player is taking damage, you should draw a healthbar, and have a gameover screen!
* Maybe add a controller object to handle your gameover screen and displaying a final score/leaderboard?
* You shoot asteroids, they blink out of existence, try making smaller ones appear instead and fly out from the parent
* Destroyed objects are still in our list, you should clean up the list now to let the unused one get removed from memory!
* What about adding a score for shooting asteroids?
* Having this in one big file is a bit messy! Try splitting each class out into it's own `.lua` file
* Instead of basic shapes, try adding your own texture and quads to give the game some nice sprites!
* Instead of bouncing asteroids off the edge of the boundary, you could teleport them to the opposite side!
* How about adding ammo, and some asteroids drop ammo pickups? Or ammo modifiers? Faster bullets, multi-spread...
* We stop abruptly when we stop holding 'W', how could you handle having the player gradually come to a halt?