import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const SearchController = Main.overview._overview.controls._searchController;

// Based on _onStageKeyPress function from https://gitlab.gnome.org/GNOME/gnome-shell/-/blob/gnome-46/js/ui/searchController.js
function _onStageKeyPress(_actor, event) {
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

export default class EscapeOverview extends Extension {
  constructor(metadata) {
    super(metadata);
    this.defaultOnStageKeyPress = SearchController._onStageKeyPress;
  }

  enable() {
    SearchController._onStageKeyPress = _onStageKeyPress;
  }

  disable() {
    SearchController._onStageKeyPress = this.defaultOnStageKeyPress;
  }
}
