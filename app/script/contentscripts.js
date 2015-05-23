(function() {
  var createElem, r, stripUnit;

  r = chrome.runtime;

  stripUnit = function(str) {
    return Number(str.match(/-?\d+/)[0]);
  };

  createElem = function(elem, id, parent) {
    elem = document.createElement(elem);
    elem.id = id;
    parent.appendChild(elem);
    return elem;
  };

  r.onMessage.addListener(function(req) {
    var cover, elem, endEvent, flags, jogi, move, promise, rotate, startEvent, sumDeg, wrapper;
    if (req.emit === 'jogi:has') {
      elem = document.getElementById('chrome-extension-jogi');
      return r.sendMessage({
        hasElem: elem != null
      }, function() {});
    } else if (req.emit === 'jogi:create') {
      wrapper = createElem('div', 'chrome-extension-jogi', document.body);
      jogi = createElem('div', 'jogi', wrapper);
      cover = createElem('div', 'jogi-cover', wrapper);
      flags = {
        move: false,
        rotate: false
      };
      promise = null;
      sumDeg = 0;
      startEvent = function(e) {
        e.preventDefault();
        e.stopPropagation();
        cover.style.display = 'block';
        if (e.shiftKey) {
          return flags.rotate = true;
        } else {
          return flags.move = true;
        }
      };
      endEvent = function(e) {
        e.preventDefault();
        e.stopPropagation();
        cover.style.display = 'none';
        flags.move = false;
        return flags.rotate = false;
      };
      move = function(e) {
        return (function(s) {
          s.left = (stripUnit(s.left) + e.movementX) + "px";
          return s.top = (stripUnit(s.top) + e.movementY) + "px";
        })(jogi.style);
      };
      rotate = function(e) {
        return (function(s) {
          var adjustmentDeg;
          if (e.altKey) {
            sumDeg += e.movementY;
            if (sumDeg < -45 || sumDeg > 45) {
              adjustmentDeg = (function() {
                var deg;
                deg = Math.abs(45 * ~~(stripUnit(s.transform) / sumDeg));
                deg = sumDeg < 0 ? deg + 90 : deg;
                if (deg === 0) {
                  return 1800;
                } else {
                  return deg;
                }
              })();
              s.transform = "rotate(" + adjustmentDeg + "deg)";
              return sumDeg = 0;
            }
          } else {
            return s.transform = "rotate(" + (stripUnit(s.transform) + e.movementY) + "deg)";
          }
        })(jogi.style);
      };
      jogi.style.left = '0px';
      jogi.style.top = '0px';
      jogi.style.transform = 'rotate(1800deg)';
      jogi.addEventListener('mousedown', startEvent);
      cover.addEventListener('mouseup', endEvent);
      return cover.addEventListener('mousemove', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (flags.move === true) {
          return move(e);
        } else if (flags.rotate === true) {
          return rotate(e);
        }
      });
    } else if (req.emit === 'jogi:remove') {
      elem = document.getElementById('chrome-extension-jogi');
      if (elem != null) {
        return document.body.removeChild(elem);
      }
    }
  });

}).call(this);

//# sourceMappingURL=contentscripts.js.map