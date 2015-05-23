r = chrome.runtime
stripUnit = (str) -> Number str.match(/-?\d+/)[0]
createElem = (elem, id, parent) ->
  elem = document.createElement elem
  elem.id = id
  parent.appendChild elem
  elem

r.onMessage.addListener (req) ->
  if req.emit is 'jogi:has'
    elem = document.getElementById 'chrome-extension-jogi'
    console.log elem?
    r.sendMessage {hasElem: elem?}, ->

  else if req.emit is 'jogi:create'
    wrapper = createElem 'div', 'chrome-extension-jogi', document.body
    jogi = createElem 'div', 'jogi', wrapper
    cover = createElem 'div', 'jogi-cover', wrapper
    flags =
      move: false
      rotate: false
    promise = null
    sumDeg = 0

    startEvent = (e) ->
      e.preventDefault()
      e.stopPropagation()
      cover.style.display = 'block'
      if e.shiftKey then flags.rotate = true
      else flags.move = true
    endEvent = (e) ->
      e.preventDefault()
      e.stopPropagation()
      cover.style.display = 'none'
      flags.move = false
      flags.rotate = false

    move = (e) ->
      do (s = jogi.style) ->
        s.left = "#{stripUnit(s.left) + e.movementX}px"
        s.top = "#{stripUnit(s.top) + e.movementY}px"
    rotate = (e) ->
      do (s = jogi.style) ->
        if e.altKey
          sumDeg += e.movementY
          if sumDeg < -45 or sumDeg > 45
            adjustmentDeg = do ->
              deg = Math.abs 45 * ~~(stripUnit(s.transform) / sumDeg)
              deg = if sumDeg < 0 then deg + 90 else deg
              if deg is 0 then 1800 else deg
            s.transform = "rotate(#{adjustmentDeg}deg)"
            sumDeg = 0
        else
          s.transform = "rotate(#{stripUnit(s.transform) + e.movementY}deg)"

    jogi.style.left = '0px'
    jogi.style.top = '0px'
    jogi.style.transform = 'rotate(1800deg)'

    jogi.addEventListener 'mousedown', startEvent
    cover.addEventListener 'mouseup', endEvent
    cover.addEventListener 'mousemove', (e) ->
      e.preventDefault()
      e.stopPropagation()
      if flags.move is true then move e
      else if flags.rotate is true then rotate e

  else if req.emit is 'jogi:remove'
    elem = document.getElementById 'chrome-extension-jogi'
    document.body.removeChild elem if elem?
