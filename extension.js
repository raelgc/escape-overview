const {Clutter, St} = imports.gi;
const Main = imports.ui.main;
const SearchController = Main.overview.viewSelector ?
                                   Main.overview.viewSelector :
                                   Main.overview._overview.controls._searchController;
let previousStageKeyPress;


// Based on _onStageKeyPress function from https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/gnome-40/js/ui/searchController.js
function _onStageKeyPress(actor, event) {
  if (Main.modalCount > 1)
    return Clutter.EVENT_PROPAGATE;

  let symbol = event.get_key_symbol();

  if (symbol === Clutter.KEY_Escape) {
    if (this._searchActive)
      this.reset();
    else
      Main.overview.hide();
      return Clutter.EVENT_STOP;
  } else if (this._shouldTriggerSearch(symbol)) {
      this.startSearch(event);
  }
  return Clutter.EVENT_PROPAGATE;
}

// Based on _onStageKeyPress function from https://github.com/GNOME/gnome-shell/blob/gnome-3-36/js/ui/viewSelector.js
function _onStageKeyPressOld(actor, event) {
  if (Main.modalCount > 1)
    return Clutter.EVENT_PROPAGATE;

  let symbol = event.get_key_symbol();

  if (symbol === Clutter.KEY_Escape) {
    if (SearchController._searchActive)
      SearchController.reset();
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
  previousStageKeyPress = SearchController._onStageKeyPress;
}

function enable() {
  SearchController._onStageKeyPress = Main.overview.viewSelector ? _onStageKeyPressOld : _onStageKeyPress;
}

function disable() {
  SearchController._onStageKeyPress = previousStageKeyPress;
}
