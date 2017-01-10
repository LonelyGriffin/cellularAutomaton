import Dispatcher from 'service/dispatcher';

export default {
	START: 'WORLD_START',
	STOP: 'WORLD_STOP',
	RESET: 'WORLD_RESET',
	SET_FIELD: 'WORLD_FIELD_SET',
	SET_FIELDS: 'WORLD_FIELDS_SET',

	start() {
		Dispatcher.fire(this.START);
	},

	stop() {
		Dispatcher.fire(this.STOP);
	},

	reset() {
		Dispatcher.fire(this.RESET);
	},

	set(point, field) {
		Dispatcher.fire(this.SET_FIELD, point, field);
	},
};
