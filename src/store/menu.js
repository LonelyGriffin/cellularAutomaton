import Dispatcher from "service/dispatcher";
import BaseStore from "store/base";
import MenuAction from "action/menu";

class MenuStore extends BaseStore {
	constructor() {
		super();

		this._state = {
			opened: false
		}

		Dispatcher.on(MenuAction.MENU_OPEN, this._openHandler.bind(this));
		Dispatcher.on(MenuAction.MENU_CLOSE, this._closeHandler.bind(this));
	}

	_openHandler() {
		this._state.opened = true;
		this._emitChanged();
	}
	_closeHandler() {
		this._state.opened = false;
		this._emitChanged();
	}
}

export default new MenuStore();