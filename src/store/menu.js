import Dispatcher from "service/dispatcher";
import BaseStore from "store/base";
import {MENU_OPEN, MENU_CLOSE} from "constant/menu";

class MenuStore extends BaseStore {
	constructor() {
		super();

		this._state = {
			opened: false
		}

		Dispatcher.on(MENU_OPEN, this._openHandler.bind(this));
		Dispatcher.on(MENU_CLOSE, this._closeHandler.bind(this));
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