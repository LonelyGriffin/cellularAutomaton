let EventEmitter = require('events').EventEmitter;

export default class BaseStore {
	constructor() {
		this._dispatcher = new EventEmitter();
		this._state = {};
	}

	_emitChanged() {
		this._dispatcher.emit("change", this._state);
	}

	addListener(callback) {
		this._dispatcher.on("change", callback);
	}

	getState(){
		return this._state;
	}
}