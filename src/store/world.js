import Dispatcher from 'service/dispatcher';
import BaseStore from 'store/base';
import WorldAction from 'action/world';
import MenuAction from 'action/menu';
import HashMap from 'declaretion/hashMap';

const stateSymbol = Symbol.for('private:store:state');
const emitChangeSymbol = Symbol.for('private:store:emitChange');
const applySettingsHandlerSymbol = Symbol.for('private:worldSrtore:applySettingHandler');
const startHandlerSymbol = Symbol.for('private:worldSrtore:startHandler');
const stopHandlerSymbol = Symbol.for('private:worldSrtore:stopHandler');
const resetHandlerSymbol = Symbol.for('private:worldSrtore:resetHandler');
const setFieldHandlerSymbol = Symbol.for('private:worldSrtore:setFieldHandler');
const setFieldsHandlerSymbol = Symbol.for('private:worldSrtore:setFieldsHandler');

class WorldStore extends BaseStore {
	constructor(...props) {
		super(...props);

		Dispatcher.on(MenuAction.APPLY_WORLD_SETTINGS, this[applySettingsHandlerSymbol]);
		Dispatcher.on(WorldAction.START, this[startHandlerSymbol]);
		Dispatcher.on(WorldAction.STOP, this[stopHandlerSymbol]);
		Dispatcher.on(WorldAction.RESET, this[resetHandlerSymbol]);
		Dispatcher.on(WorldAction.SET_FIELD, this[setFieldHandlerSymbol]);
		Dispatcher.on(WorldAction.SET_FIELDS, this[setFieldsHandlerSymbol]);
	}

	[stateSymbol] = {
		isLaunched: false,
		width: 70,
		height: 40,
		// signature: key - {x:0, y:0}, value - {isLive: true}.
		// if isLive = false then it field need to remove.
		fields: new HashMap(),
		changedFields: new HashMap(),
	}

	createField({ isLive = false } = { isLive: false }) {
		return {
			isLive,
		};
	}

	isValidPoint(point) {
		if (point.x < 0 || point.x >= this.width || point.y < 0 || point.y >= this.height) {
			return false;
		}
		return true;
	}

	getField(point) {
		return (this[stateSymbol].fields.get(point) || this.createField());
	}

	getFields() {
		return this[stateSymbol].fields;
	}

	getNeighborFields(point) {
		if (this.isValidPoint(point)) {
			let neighborPoints = [
				{ x: point.x - 1,	y: point.y - 1 	},
				{ x: point.x - 1,	y: point.y 		},
				{ x: point.x - 1,	y: point.y + 1 	},
				{ x: point.x,		y: point.y - 1 	},
				{ x: point.x,		y: point.y + 1 	},
				{ x: point.x + 1,	y: point.y - 1 	},
				{ x: point.x + 1,	y: point.y 		},
				{ x: point.x + 1,	y: point.y + 1 	},
			];

			// path cycling map
			neighborPoints = neighborPoints.map((neighborPoint) => {
				const newNeighborPoint = {
					x: neighborPoint.x,
					y: neighborPoint.y,
				};
				if (neighborPoint.x < 0) {
					newNeighborPoint.x = this[stateSymbol].width - 1;
				}
				if (neighborPoint.x >= this[stateSymbol].width) {
					newNeighborPoint.x = 0;
				}
				if (neighborPoint.y < 0) {
					newNeighborPoint.y = this[stateSymbol].height - 1;
				}
				if (neighborPoint.y >= this[stateSymbol].height) {
					newNeighborPoint.y = 0;
				}
				return newNeighborPoint;
			});

			return new Map(neighborPoints.map(neighborPoint =>
				[neighborPoint, this[stateSymbol].fields.get(neighborPoint) || this.createField()]));
		}
		return new Map();
	}

	getMayBeChangeFields() {
		const result = new HashMap();

		this[stateSymbol].changedFields.forEach((changedField, changedPoint) => {
			const neighborFields = this.getNeighborFields(changedPoint);
			neighborFields.forEach((neighborField, neighborPoint) =>
				result.set(neighborPoint, neighborField));
			result.set(changedPoint, changedField);
		});

		return result;
	}

	getToChangeFields() {
		const result = new HashMap();
		const mayBeChangeFields = this.getMayBeChangeFields();

		mayBeChangeFields.forEach((mayBeChangeField, mayBeChangePoint) => {
			let countLiveNeighborFields = 0;
			const neighborFields = this.getNeighborFields(mayBeChangePoint);
			neighborFields.forEach((neighborField) => {
				if (neighborField.isLive) {
					countLiveNeighborFields++;
				}
			});
			if (mayBeChangeField.isLive) {
				if (countLiveNeighborFields < 2 || countLiveNeighborFields > 3) {
					result.set(mayBeChangePoint, this.createField());
				}
			} else if (countLiveNeighborFields === 3) {
				result.set(mayBeChangePoint, this.createField({ isLive: true }));
			}
		});

		return result;
	}

	setField(point, field) {
		if (this.isValidPoint(point)) {
			this[stateSymbol].changedFields.set(point, field);
			if (field.isLive) {
				this[stateSymbol].fields.set(point, field);
			} else {
				this[stateSymbol].fields.delete(point);
				if (!this[stateSymbol].isLaunched) {
					this[stateSymbol].changedFields.delete(point);
				}
			}
		}
	}

	setFields(fields) {
		fields.forEach((field, point) => {
			this.setField(point, field);
		});
	}

	[applySettingsHandlerSymbol] = ({ width, height }) => {
		let isChanged = false;
		if (width && width !== this[stateSymbol].width) {
			this[stateSymbol].width = width;
			isChanged = true;
		}
		if (height && height !== this[stateSymbol].height) {
			this[stateSymbol].height = height;
			isChanged = true;
		}
		if (isChanged) {
			this[emitChangeSymbol]();
		}
	}

	[startHandlerSymbol] = () => {
		this[stateSymbol].isLaunched = true;

		this[emitChangeSymbol]();

		const timer = setInterval(() => {
			if (this[stateSymbol].isLaunched) {
				const toChangeFields = this.getToChangeFields();
				this[stateSymbol].changedFields.clear();
				this.setFields(toChangeFields);
				this[emitChangeSymbol]();
			} else {
				clearInterval(timer);
			}
		}, 300);
	}
	[stopHandlerSymbol] = () => {
		this[stateSymbol].isLaunched = false;
		this[emitChangeSymbol]();
	}
	[resetHandlerSymbol] = () => {
		this[stateSymbol].isLaunched = false;
		this[stateSymbol].fields.clear();
		this[stateSymbol].changedFields.clear();
		this[emitChangeSymbol]();
	}
	[setFieldHandlerSymbol] = (point, field) => {
		this.setField(point, field);
		this[emitChangeSymbol]();
	}
	[setFieldsHandlerSymbol] = (fields) => {
		this.setFields(fields);
		this[emitChangeSymbol]();
	}
}

export default new WorldStore();
