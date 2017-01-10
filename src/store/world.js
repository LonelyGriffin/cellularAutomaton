import BaseStore from 'store/base';
import WorldAction from 'action/world';
import MenuAction from 'action/menu';
import HashMap from 'declaretion/hashMap';

const stateSymbol = Symbol.for('private:store:state');
const emitChangeSymbol = Symbol.for('private:store:emitChange');
const handlersSymbol = Symbol.for('private:store:handlers');

class WorldStore extends BaseStore {
	[stateSymbol] = {
		isLaunched: false,
		isFirstFrame: true,
		width: 70,
		height: 40,
		verticalFixation: true,
		horizontalFixation: true,
		// signature: key - {x:0, y:0}, value - {isLive: true}.
		// if isLive = false then it field need to remove.
		firstFrame: new HashMap(),
		fields: new HashMap(),
		changedFields: new HashMap(),
	}
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

			// path fixation
			if (this[stateSymbol].horizontalFixation) {
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
					return newNeighborPoint;
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
				neighborPoints = neighborPoints.map((neighborPoint) => {
					const newNeighborPoint = {
						x: neighborPoint.x,
						y: neighborPoint.y,
					};
					if (neighborPoint.y < 0) {
						newNeighborPoint.y = this[stateSymbol].height - 1;
					}
					if (neighborPoint.y >= this[stateSymbol].height) {
						newNeighborPoint.y = 0;
					}
					return newNeighborPoint;
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
		this[stateSymbol].isFirstFrame = false;
		const timer = setInterval(() => {
			if (this[stateSymbol].isLaunched) {
				const toChangeFields = this.getToChangeFields();
				if (toChangeFields.size() > 0) {
					this[stateSymbol].changedFields.clear();
					this.setFields(toChangeFields);
				} else {
					this.pause();
				}
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
	}

	reset() {
		this.pause();
		this[stateSymbol].isFirstFrame = true;
		this[stateSymbol].fields.clear();
		this[stateSymbol].changedFields.clear();
		this[stateSymbol].firstFrame.clear();
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
		[WorldAction.SET_FIELD](point, field) {
			this.setField(point, field);
			this[emitChangeSymbol]();
		},
		[WorldAction.SET_FIELDS](fields) {
			this.setFields(fields);
			this[emitChangeSymbol]();
		},
		[MenuAction.APPLY_WORLD_SETTINGS]({ width, height, verticalFixation = true, horizontalFixation = true }) {
			let isChanged = false;
			if (width && width !== this[stateSymbol].width) {
				this[stateSymbol].width = width;
				isChanged = true;
			}
			if (height && height !== this[stateSymbol].height) {
				this[stateSymbol].height = height;
				isChanged = true;
			}
			if (verticalFixation !== this[stateSymbol].verticalFixation) {
				this[stateSymbol].verticalFixation = verticalFixation;
				isChanged = true;
			}
			if (horizontalFixation !== this[stateSymbol].horizontalFixation) {
				this[stateSymbol].horizontalFixation = horizontalFixation;
				isChanged = true;
			}
			if (isChanged) {
				this[emitChangeSymbol]();
			}
		},
	}
}
export default new WorldStore();
