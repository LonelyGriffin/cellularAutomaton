import Dispatcher from "service/dispatcher";
import BaseStore from "store/base";
//TODO: перенести константы в action
import { WORLD_START, WORLD_STOP, WORLD_RESET, WORLD_FIELD_TOGGLE, WORLD_FIELDS_TOGGLE } from "constant/world";

let nextStateGenerator = {
	_getNeighborFields(field) {
		return [
			{ x: field.x - 1, y: field.y - 1 },
			{ x: field.x - 1, y: field.y },
			{ x: field.x - 1, y: field.y + 1 },
			{ x: field.x, y: field.y - 1 },
			{ x: field.x, y: field.y + 1 },
			{ x: field.x + 1, y: field.y - 1 },
			{ x: field.x + 1, y: field.y },
			{ x: field.x + 1, y: field.y + 1 }
		];

	},

	getToChangeFields(fields) {
		let result = {};
		for(let key in fields) {
			let field = fields[key];
			let toChangeFields = this._getNeighborFields(field);

			result[field.x + "_" + field.y] = field;
			for(let toChangeField of toChangeFields) {
				result[toChangeField.x + "_" + toChangeField.y] = toChangeField;
			}
		}
		return result;
	},

	getFieldsToToggle(stateFields, changedFields) {
		let result = {};
		let toChangeFields = this.getToChangeFields(changedFields);
		for(let key in toChangeFields) {
			let toChangeField = toChangeFields[key];

			let neighborFields = this._getNeighborFields(toChangeField);
			let countLiveNeighborFields = 0;
			for(let neighborField of neighborFields) {
				if(stateFields[neighborField.x + "_" + neighborField.y]) {
					countLiveNeighborFields++;
				}
			}

			if(stateFields[toChangeField.x + "_" + toChangeField.y]) {
				if(countLiveNeighborFields < 2 || countLiveNeighborFields > 3) {
					result[toChangeField.x + "_" + toChangeField.y] = toChangeField;
				}
			} else {
				if(countLiveNeighborFields == 3) {
					result[toChangeField.x + "_" + toChangeField.y] = toChangeField;
				}
			}

		}
		return result;
	}
}

class WorldStore extends BaseStore {
	constructor() {
		super();

		this._state = {
			launched: false,
			width: 25,
			height: 25,
			fields: {} // key - "5_6" value - {x:5,y:6} if set: fill field else empty field 
		}

		this._toChangeFields = {};

		Dispatcher.on(WORLD_START, this._startHandler.bind(this));
		Dispatcher.on(WORLD_STOP, this._stopHandler.bind(this));
		Dispatcher.on(WORLD_RESET, this._resetHandler.bind(this));
		Dispatcher.on(WORLD_FIELD_TOGGLE, this._toggleFieldHandler.bind(this));
	}

	/// private methods ///
	
	_toggleField(fieldX, fieldY) {
		let key = fieldX + '_' + fieldY;
		if(this._state.fields[key]) {
			delete this._state.fields[key];
		} else {
			this._state.fields[key] = {
				x: fieldX,
				y: fieldY
			}
		}
	}

	_toggleFields(fields) {
		for(let key in fields) {
			let field = fields[key];
			this._toggleField(field.x, field.y);
		}
	}

	/// event handlers ///
	
	_startHandler() {
		this._state.launched = true;

		let changedFields = nextStateGenerator.getToChangeFields(this._state.fields);

		let timer = setInterval(() => {
			if(this._state.launched) {
				changedFields = nextStateGenerator.getFieldsToToggle(this._state.fields, changedFields);
				this._toggleFields(changedFields);

				this._emitChanged();
			} else {
				clearInterval(timer);
			}
		}, 300);

		this._emitChanged();
	}
	_stopHandler() {
		this._state.launched = false;
		this._emitChanged();
	}
	_resetHandler() {
		this._state.fields = {};
		this._emitChanged();
	}
	_toggleFieldHandler(fieldX, fieldY) {
		this._toggleField(fieldX, fieldY);
		this._emitChanged();
	}
}

export default new WorldStore();