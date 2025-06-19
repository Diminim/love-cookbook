# LÖVE Cookbook Style Guide
To keep the quality of the cookbook consistent, it's imperative to have a consistent style guide for the whole project. This makes it much easier to read and write, especially for an open-source body of work with potentially dozens of contributors. This guide covers both code and the written word.

These decisions focus on **readability.** This book is a resource for all devs, including total beginners, so it's important to minimize obscurity, inconsistency, and gotchas.

# Writing
* [Write in plain English.](https://www.plainenglish.co.uk/how-to-write-in-plain-english.html) In short:
	* **Keep your sentences short**: They should be, on average, 15 to 20 words;
	* **Prefer active verbs**: "Peter wrote code" instead of "the code was written by Peter";
	* **Use "you" and "we"**: "We advise you to..." instead of "the programmer is advised by this book to...";
	* **Use words that are appropriate for the reader**: Avoid jargon and keep to everyday English, especially in beginner-friendly sections;
	* **Don't be afraid to give instructions**: "Be punchy" instead of "you should aim to be punchy";
	* **Avoid nominalizations**: "We discussed it" instead of "we had a discussion about it";
	* **Use lists when appropriate**.
* Don't make this a LÖVE Wiki 2.0. It should be more high-level and abstract, focusing on strategies, interactions, and common problems you might come across. It shouldn't be a list explaining what everything does.

# Code
* Indent all code blocks with 2 spaces. This makes it easier to read multiple levels of indentation, especially on a smaller screen.
```lua
-- Good:
function add10(n)
  return n + 10
end

-- Bad:
function add10(n)
	return n + 10
end

function add10(n)
    return n + 10
end

function add10(n)
 return n + 10
end
```

* Name all variables in `camelCase`, including functions. Reserve `PascalCase` for classes and `UPPER_SNAKE_CASE` for constant globals (although those are rare).
```lua
-- Good:
local NewClass = Class:extend()
local currentTemperature = self:getCurrentTemperature()
MAXIMUM_TEMPERATURE = 100
-- Bad:
local new_class = Class:extend()
local current_temperature = self:get_current_temperature()
maximumtemperature = 100
```

* Write comments as fully-formed sentences, with proper capitalizing and punctuation, to make them easier to read at a glance. Put a space before the start of the comment.
```lua
--this is a bad comment (kinda hard to read (its fine ig but could be better))
-- This is a better comment. It reads like a regular sentence.
```

* Don't write comments that just reinstate a line of code. Prefer comments that describe overarching concepts at a high level, explain some tricky or unintuitive operation, or clarify a decision.
```lua
-- Good:

-- The amount of blank space added to the left and right of every line,
-- in pixels.
local horizontalPadding = 4

-- Bad:

-- The amount of padding to be applied horizontally.
local horizontalPadding = 4

-- Good:

-- Using the square of the progress gives a smoother easing curve than just
-- progress by itself.
self.distance = self.length * self.progress * self.progress

-- Bad:

-- Set distance to the current length times the current progress, squared.
self.distance = self.length * self.progress * self.progress

-- Good:

-- Set a new max temperature.
-- Since previously stored calculations become invalid when the max temperature
-- changes, this also clears the cache.
function self:setMaxTemperature(newMax)
  self.maxTemperature = newMax
  self:clearCache()
end

-- Bad:

-- Set maxTemperature, then clear the cache.
function self:setMaxTemperature(newMax)
  self.maxTemperature = newMax
  self:clearCache()
end
```

* Prefer double-quotes over single-quotes. Single-quotes are OK if it makes the string more readable.
```lua
-- Good:
name = "John"
-- Bad:
name = 'John'
-- This is ok:
print('Between "do" or "die," the choice is obvious.')
```

* Put whitespace around operators and after commas.
```lua
-- Good:
result = "The answer was: " .. tostring(a + b)
numbers = {1, 2, 3}
-- Bad:
result="The answer was: "..tostring(a+b)
numbers={1,2,3}
```

* Don't put whitespace around parentheses.
```lua
-- Good:
print(a + b)
print(results[1])
printEach({1, 2, 3})
-- Bad:
print (a + b)
print( a + b )
print(results[ 1 ])
printEach({ 1, 2, 3 })
```

* Don't omit parenthesis for functions that take string and table literals, as that makes it harder to tell where functions start and end, and obscures precedence rules.
```lua
-- Good:
local data = getData("john") .. inspect({name, age, birthday})
-- Bad:
local data = getData"john"..inspect{name, age, birthday}
```
