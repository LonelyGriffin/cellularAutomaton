import Dispatcher from 'service/dispatcher';
import BaseStore from 'store/base';
import MenuAction from 'action/menu';
import WorldStore from 'store/world';

const stateSymbol = Symbol.for('private:store:state');
const emitChangeSymbol = Symbol.for('private:store:emitChange');
const openHandlerSymbol = Symbol.for('private:menuStore:openHandler');
const closeHandlerSymbol = Symbol.for('private:menuStore:closeHandler');
const setWorldWidthHandlerSymbol = Symbol.for('private:menuStore:setWorldWidthHandler');
const setWorldHeightHandlerSymbol = Symbol.for('private:menuStore:setWorldHeightHandler');

const worldDefaultState = WorldStore.getState();

const Validate = {
	isNumber(number) {
		return !isNaN(+number);
	},
	between({ value, max, min, def }) {
		const validMax = Validate.isNumber(max) ? max : Number.POSITIVE_INFINITY;
		const validMin = Validate.isNumber(min) ? min : Number.NEGATIVE_INFINITY;
		const validDefault = Validate.isNumber(def) ? def : 0;
		let validValue = Validate.isNumber(value) ? value : validDefault;

		if (validValue < validMin) {
			validValue = validMin;
		}
		if (validValue > validMax) {
			validValue = validMax;
		}

		return validValue;
	},
};

class MenuStore extends BaseStore {
	constructor() {
		super();

		Dispatcher.on(MenuAction.OPEN, this[openHandlerSymbol]);
		Dispatcher.on(MenuAction.CLOSE, this[closeHandlerSymbol]);
		Dispatcher.on(MenuAction.CHANGE_SETTING_WIDTH, this[setWorldWidthHandlerSymbol]);
		Dispatcher.on(MenuAction.CHANGE_SETTING_HEIGHT, this[setWorldHeightHandlerSymbol]);
	}

	[openHandlerSymbol] = () => {
		this[stateSymbol].isOpened = true;
		this[emitChangeSymbol]();
	}
	[closeHandlerSymbol] = () => {
		this[stateSymbol].isOpened = false;
		this[emitChangeSymbol]();
	}
	[setWorldWidthHandlerSymbol] = (newWidth, isHardValidate = false) => {
		if (isHardValidate) {
			this[stateSymbol].world.width = Validate.between({
				value: newWidth,
				min: this[stateSymbol].worldRestrictions.minWidth,
				max: this[stateSymbol].worldRestrictions.maxWidth,
				def: this[stateSymbol].world.width,
			});
		} else {
			this[stateSymbol].world.width =
				Validate.isNumber(newWidth) ? newWidth : this[stateSymbol].world.width;
		}
		this[emitChangeSymbol]();
	}
	[setWorldHeightHandlerSymbol] = (newHeight, isHardValidate = false) => {
		if (isHardValidate) {
			this[stateSymbol].world.height = Validate.between({
				value: newHeight,
				min: this[stateSymbol].worldRestrictions.minHeight,
				max: this[stateSymbol].worldRestrictions.maxHeight,
				def: this[stateSymbol].world.height,
			});
		} else {
			this[stateSymbol].world.height =
				Validate.isNumber(newHeight) ? newHeight : this[stateSymbol].world.height;
		}
		this[emitChangeSymbol]();
	}
	[stateSymbol] = {
		isOpened: false,
		worldRestrictions: {
			maxWidth: 100,
			minWidth: 10,
			maxHeight: 60,
			minHeight: 10,
		},
		world: {
			width: worldDefaultState.width,
			height: worldDefaultState.height,
		},
	}
}

export default new MenuStore();
