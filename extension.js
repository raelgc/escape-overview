const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const ViewSelector = Main.overview.viewSelector;
let previousStageKeyPress;

// Based on _onStageKeyPress function from https://github.com/GNOME/gnome-shell/blob/gnome-3-20/js/ui/viewSelector.js
function _onStageKeyPress(actor, event) {
  if (Main.modalCount > 1)
    return Clutter.EVENT_PROPAGATE;

  let symbol = event.get_key_symbol();

  if (symbol === Clutter.KEY_Escape) {
    if (ViewSelector._searchActive)
      ViewSelector.reset();
    else
      Main.overview.hide();
      return Clutter.EVENT_STOP;
  } else if (this._shouldTriggerSearch(symbol)) {
      this.startSearch(event);
  } else if (!this._searchActive && !global.stage.key_focus) {
    if (symbol === Clutter.KEY_Tab || symbol === Clutter.KEY_Down) {
      this._activePage.navigate_focus(null, St.DirectionType.TAB_FORWARD, false);
      return Clutter.EVENT_STOP;
    } else if (symbol === Clutter.KEY_ISO_Left_Tab) {
      this._activePage.navigate_focus(null, St.DirectionType.TAB_BACKWARD, false);
      return Clutter.EVENT_STOP;
    }
  }
  return Clutter.EVENT_PROPAGATE;
}

function init() {
  previousStageKeyPress = ViewSelector._onStageKeyPress;
}

function enable() {
  ViewSelector._onStageKeyPress = _onStageKeyPress;
}

function disable() {
  ViewSelector._onStageKeyPress = previousStageKeyPress;
}
