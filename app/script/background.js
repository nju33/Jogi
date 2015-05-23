(function() {
  var b, confirmBa, r, t, updateBa;

  b = chrome.browserAction;

  t = chrome.tabs;

  r = chrome.runtime;

  updateBa = function(title, iconPath) {
    b.setTitle({
      title: title
    });
    return b.setIcon({
      path: iconPath
    });
  };

  confirmBa = function(id) {
    t.sendMessage(id, {
      emit: 'jogi:has'
    }, function() {});
    return r.onMessage.addListener(function(req) {
      if (req.hasElem) {
        return updateBa('Remove Jogi', 'icon/icon_38_act.png');
      } else {
        return updateBa('Create Jogi', 'icon/icon_38.png');
      }
    });
  };

  t.onUpdated.addListener(confirmBa);

  t.onSelectionChanged.addListener(confirmBa);

  b.onClicked.addListener(function(tab) {
    return b.getTitle({}, function(title) {
      if (title === 'Create Jogi') {
        t.sendMessage(tab.id, {
          emit: 'jogi:create'
        }, function() {});
        return updateBa('Remove Jogi', 'icon/icon_38_act.png');
      } else if (title === 'Remove Jogi') {
        t.sendMessage(tab.id, {
          emit: 'jogi:remove'
        }, function() {});
        return updateBa('Create Jogi', 'icon/icon_38.png');
      }
    });
  });

}).call(this);

//# sourceMappingURL=background.js.map