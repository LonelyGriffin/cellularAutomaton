import Dispatcher from 'service/dispatcher';
import BaseStore from 'store/base';
import MenuAction from 'action/menu';

const stateSymbol = Symbol.for('private:store:state');
const emitChange = Symbol.for('private:store:emitChange');

class MenuStore extends BaseStore {
	constructor() {
		super();

		Dispatcher.on(MenuAction.OPEN, this.openHandler.bind(this));
		Dispatcher.on(MenuAction.CLOSE, this.closeHandler.bind(this));
	}

	[stateSymbol] = {
		opened: false,
	}

	openHandler = () => {
		this[stateSymbol].opened = true;
		this[emitChange]();
	}
	closeHandler = () => {
		this[stateSymbol].opened = false;
		this[emitChange]();
	}
}

export default new MenuStore();
