b = chrome.browserAction
t = chrome.tabs
r = chrome.runtime

updateBa = (title, iconPath) ->
  b.setTitle {title: title}
  b.setIcon {path: iconPath}
confirmBa = (id) ->
  t.sendMessage id, {emit: 'jogi:has'}, ->
  r.onMessage.addListener (req) ->
    if req.hasElem then updateBa 'Remove Jogi', 'icon/icon_38_act.png'
    else updateBa 'Create Jogi', 'icon/icon_38.png'

t.onUpdated.addListener confirmBa
t.onSelectionChanged.addListener confirmBa

b.onClicked.addListener (tab) ->
  b.getTitle {}, (title) ->
    if title is 'Create Jogi'
      t.sendMessage tab.id, {emit: 'jogi:create'}, ->
      updateBa 'Remove Jogi', 'icon/icon_38_act.png'
    else if title is 'Remove Jogi'
      t.sendMessage tab.id, {emit: 'jogi:remove'}, ->
      updateBa 'Create Jogi', 'icon/icon_38.png'
