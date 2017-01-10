import BaseStore from 'store/base';
import MenuAction from 'action/menu';
import WorldStore from 'store/world';

const stateSymbol = Symbol.for('private:store:state');
const emitChangeSymbol = Symbol.for('private:store:emitChange');
const handlersSymbol = Symbol.for('private:store:handlers');

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

	constructor(...props) {
		super(...props);

		this.initHandlers();
	}

	[handlersSymbol] = {
		[MenuAction.OPEN]() {
			this[stateSymbol].isOpened = true;
			this[emitChangeSymbol]();
		},
		[MenuAction.CLOSE]() {
			this[stateSymbol].isOpened = false;
			this[emitChangeSymbol]();
		},
		[MenuAction.CHANGE_SETTING_WIDTH](newWidth, isHardValidate = false) {
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
		},
		[MenuAction.CHANGE_SETTING_HEIGHT](newHeight, isHardValidate = false) {
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
		},
	}
}

export default new MenuStore();
