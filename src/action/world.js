import Dispatcher from 'service/dispatcher';

export default {
	START: 'WORLD:START',
	STOP: 'WORLD:STOP',
	RESET: 'WORLD:RESET',
	SET_FIELD: 'WORLD:FIELD:SET',
	SET_FIELDS: 'WORLD:FIELDS:SET',

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
