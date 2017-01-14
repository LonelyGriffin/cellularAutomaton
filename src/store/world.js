import BaseStore from 'store/base';
import WorldAction from 'action/world';
import MenuAction from 'action/menu';
import HashMap from 'declaretion/hashMap';

const stateSymbol = Symbol.for('private:store:state');
const emitChangeSymbol = Symbol.for('private:store:emitChange');
const handlersSymbol = Symbol.for('private:store:handlers');

class WorldStore extends BaseStore {
	TYPE = {
		SQUERY: 'WORLD_STORE_SQUERY_TYPE',
		HEX: 'WORLD_STORE_HEX_TYPE',
	};

	[stateSymbol] = {
		type: this.TYPE.SQUERY,
		isLaunched: false,
		isFirstFrame: true,
		isExceedingHistoryLimit: false,
		historyLimit: 100,
		width: 70,
		height: 40,
		verticalFixation: true,
		horizontalFixation: true,
		// signature: key - {x:0, y:0}, value - {isLive: true}.
		// if isLive = false then it field need to remove.
		firstFrame: new HashMap(),
		fields: new HashMap(),
		changedFields: new HashMap(),
		history: [],
	};

	constructor(...props) {
		super(...props);

		this.initHandlers();
	}

	createField({ isLive = false } = { isLive: false }) {
		return {
			isLive,
		};
	}

	isValidPoint(point) {
		if (point.x < 0 || point.x >= this[stateSymbol].width || point.y < 0 || point.y >= this[stateSymbol].height) {
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

	getNeighborPoints(point) {
		let neighbors;
		switch (this[stateSymbol].type) {
		default:
		case this.TYPE.SQUERY:
			neighbors = [
				{ x: point.x - 1,	y: point.y - 1 	},
				{ x: point.x - 1,	y: point.y 		},
				{ x: point.x - 1,	y: point.y + 1 	},
				{ x: point.x,		y: point.y - 1 	},
				{ x: point.x,		y: point.y + 1 	},
				{ x: point.x + 1,	y: point.y - 1 	},
				{ x: point.x + 1,	y: point.y 		},
				{ x: point.x + 1,	y: point.y + 1 	},
			];
			break;
		case this.TYPE.HEX:
			neighbors = [
				{ x: point.x + 1,	y: point.y	 	},
				{ x: point.x,		y: point.y - 1	},
				{ x: point.x - 1,	y: point.y - 1 	},
				{ x: point.x - 1,	y: point.y  	},
				{ x: point.x - 1,	y: point.y + 1 	},
				{ x: point.x,		y: point.y + 1	},
			];
		}
		return neighbors;
	}

	getNeighborFields(point) {
		if (this.isValidPoint(point)) {
			let neighborPoints = this.getNeighborPoints(point);

			// path fixation
			if (this[stateSymbol].horizontalFixation) {
				neighborPoints.forEach((neighborPoint, index) => {
					if (neighborPoint.x < 0) {
						neighborPoints[index].x = this[stateSymbol].width - 1;
					}
					if (neighborPoint.x >= this[stateSymbol].width) {
						neighborPoints[index].x = 0;
					}
				});
			} else {
				neighborPoints = neighborPoints.filter((neighborPoint) => {
					if (neighborPoint.x < 0 || neighborPoint.x >= this[stateSymbol].width) {
						return false;
					}
					return true;
				});
			}
			if (this[stateSymbol].verticalFixation) {
				neighborPoints.forEach((neighborPoint, index) => {
					if (neighborPoint.y < 0) {
						neighborPoints[index].y = this[stateSymbol].height - 1;
					}
					if (neighborPoint.y >= this[stateSymbol].height) {
						neighborPoints[index].y = 0;
					}
				});
			} else {
				neighborPoints = neighborPoints.filter((neighborPoint) => {
					if (neighborPoint.y < 0 || neighborPoint.y >= this[stateSymbol].height) {
						return false;
					}
					return true;
				});
			}

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
				if (this[stateSymbol].isFirstFrame) {
					this[stateSymbol].firstFrame.set(point, field);
				}
			} else {
				this[stateSymbol].fields.delete(point);
				if (!this[stateSymbol].isLaunched) {
					this[stateSymbol].changedFields.delete(point);
				}
				if (this[stateSymbol].isFirstFrame) {
					this[stateSymbol].firstFrame.delete(point);
				}
			}
		}
	}

	setFields(fields) {
		fields.forEach((field, point) => {
			this.setField(point, field);
		});
	}

	start() {
		this[stateSymbol].isLaunched = true;
		const timer = setInterval(() => {
			if (this[stateSymbol].isLaunched) {
				this.redo();
				this[emitChangeSymbol]();
			} else {
				clearInterval(timer);
			}
		}, 300);
	}

	pause() {
		this[stateSymbol].isLaunched = false;
	}

	stop() {
		this.pause();
		this[stateSymbol].isFirstFrame = true;
		this[stateSymbol].fields = this[stateSymbol].firstFrame.clone();
		this[stateSymbol].changedFields = this[stateSymbol].firstFrame.clone();
		this[stateSymbol].history = [];
		this[stateSymbol].isExceedingHistoryLimit = false;
	}

	reset() {
		this.stop();
		this[stateSymbol].fields.clear();
		this[stateSymbol].changedFields.clear();
		this[stateSymbol].firstFrame.clear();
	}

	redo() {
		const toChangeFields = this.getToChangeFields();
		if (toChangeFields.size() > 0) {
			this[stateSymbol].isFirstFrame = false;
			this[stateSymbol].changedFields.clear();
			this[stateSymbol].history.push(toChangeFields);
			this.setFields(toChangeFields);
			if (this[stateSymbol].history.length > this[stateSymbol].historyLimit) {
				this[stateSymbol].isExceedingHistoryLimit = true;
				do {
					this[stateSymbol].history.shift();
				} while (this[stateSymbol].history.length > this[stateSymbol].historyLimit);
			}
		} else {
			this.pause();
		}
	}

	undo() {
		const history = this[stateSymbol].history;
		const toChangeFields = history.pop();

		if (toChangeFields) {
			const reversToChangeFields = new HashMap();
			toChangeFields.forEach((field, point) => {
				reversToChangeFields.set(point, this.createField({ isLive: !field.isLive }));
			});
			this.setFields(reversToChangeFields);
		}
		if (history.length > 0) {
			this[stateSymbol].changedField = history[history.length - 1].clone();
		} else if (!this[stateSymbol].isExceedingHistoryLimit) {
			this[stateSymbol].changedField = this[stateSymbol].firstFrame.clone();
			this[stateSymbol].fields = this[stateSymbol].firstFrame.clone();
			this[stateSymbol].isFirstFrame = true;
		}
	}

	[handlersSymbol] = {
		[WorldAction.RESET]() {
			this.reset();
			this[emitChangeSymbol]();
		},
		[WorldAction.START]() {
			this.start();
			this[emitChangeSymbol]();
		},
		[WorldAction.PAUSE]() {
			this.pause();
			this[emitChangeSymbol]();
		},
		[WorldAction.STOP]() {
			this.stop();
			this[emitChangeSymbol]();
		},
		[WorldAction.REDO]() {
			this.redo();
			this[emitChangeSymbol]();
		},
		[WorldAction.UNDO]() {
			this.undo();
			this[emitChangeSymbol]();
		},
		[WorldAction.SET_FIELD](point, field) {
			this.setField(point, field);
			this[emitChangeSymbol]();
		},
		[WorldAction.SET_FIELDS](fields) {
			this.setFields(fields);
			this[emitChangeSymbol]();
		},
		[MenuAction.APPLY_WORLD_SETTINGS](settings = {}) {
			let isChanged = false;
			if (settings.width) settings.width = +settings.width;
			if (settings.height) settings.height = +settings.height;
			Object.keys(settings).forEach((name) => {
				const value = settings[name];
				if (this[stateSymbol][name] !== undefined && this[stateSymbol][name] !== value) {
					this[stateSymbol][name] = value;
					isChanged = true;
				}
			});
			if (isChanged) {
				this[emitChangeSymbol]();
			}
		},
	};
}
export default new WorldStore();
