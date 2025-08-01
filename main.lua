-- check overlapping
function overlapping(b1, b2)
  return b1.x1 < b2.x2 and b1.x2 > b2.x1 and b1.y1 < b2.y2 and b1.y2 > b2.y1
end

-- make boxes
local boxes = {}
love.load = function()
  for i=1,100 do
    -- random boxes in screen bounds
    local x = love.math.random(0, 800-32)
    local y = love.math.random(0, 600-32)
    table.insert(boxes, {
      x1 = x,
      y1 = y,
      x2 = x+16,
      y2 = y+16,
      w = 16,
      h = 16,
      angle = math.rad(love.math.random(0, 360)),
      speed = 1,
      overlapping = false,
    })
  end
end

-- update boxes
love.update = function()
  for b=1,#boxes do
    local box = boxes[b]
    -- calculate delta based on angle
    local vy = math.sin(box.angle) * box.speed
    local vx = math.cos(box.angle) * box.speed
    box.x1 = box.x1 + vx
    box.y1 = box.y1 + vy
    -- update x2/y2 as our box has moved so our bounding box has too
    box.x2 = box.x1 + box.w
    box.y2 = box.y1 + box.h
    -- check overlap with other boxes
    local overlap = false
    for o=1,#boxes do
      if boxes[b] ~= boxes[o] and overlapping(boxes[b], boxes[o]) then
        overlap = true
        break
      end
    end
    box.overlapping = overlap
    -- bounce if we hit the edge of the screen
    if box.x1 <= 0 then
      box.angle = box.angle * math.pi
      box.x1 = 0
    end
    if box.x2 >= 800 then
      box.angle = box.angle * math.pi
      box.x2 = 800-16
    end
    if box.y1 <= 0 then
      box.angle = box.angle * (2*math.pi)
      box.y1 = 0
    end
    if box.y2 >= 600 then
      box.angle = box.angle * (2*math.pi)
      box.y2 = 600-16
    end
  end
end

-- draw boxes
love.draw = function()
  for b=1,#boxes do
    local box = boxes[b]
    love.graphics.setColor(0.1, 0.1, 0.1, 1)
    if box.overlapping then
      love.graphics.setColor(1, 0, 1, 1)
    end
    love.graphics.rectangle('fill', box.x1, box.y1, box.w, box.h)
    love.graphics.setColor(1, 1, 1, 1)
    love.graphics.rectangle('line', box.x1, box.y1, box.w, box.h)
  end
end