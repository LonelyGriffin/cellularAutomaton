import Dispatcher from 'service/dispatcher';

const WorldAction = {
	START: 'WORLD_START',
	STOP: 'WORLD_STOP',
	RESET: 'WORLD_RESET',
	PAUSE: 'WORLD_PAUSE',
	REDO: 'WORLD_REDO',
	UNDO: 'WORLD_UNDO',
	SET_FIELD: 'WORLD_FIELD_SET',
	SET_FIELDS: 'WORLD_FIELDS_SET',

	start() {
		Dispatcher.fire(WorldAction.START);
	},

	stop() {
		Dispatcher.fire(WorldAction.STOP);
	},

	reset() {
		Dispatcher.fire(WorldAction.RESET);
	},

	pause() {
		Dispatcher.fire(WorldAction.PAUSE);
	},

	redo() {
		Dispatcher.fire(WorldAction.REDO);
	},

	undo() {
		Dispatcher.fire(WorldAction.UNDO);
	},

	set(point, field) {
		Dispatcher.fire(WorldAction.SET_FIELD, point, field);
	},
};

export default WorldAction;
