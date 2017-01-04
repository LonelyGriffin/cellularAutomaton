import Dispatcher from "service/dispatcher";

export default {
	WORLD_START: 'WORLD:START',
	WORLD_STOP: 'WORLD:STOP',
	WORLD_RESET: 'WORLD:RESET',
	WORLD_FIELD_TOGGLE: 'WORLD:FIELD:TOGGLE',

	start(){
		Dispatcher.emit(this.WORLD_START);

	},

	stop(){
		Dispatcher.emit(this.WORLD_STOP);
	},

	reset() {
		Dispatcher.emit(this.WORLD_RESET);
	},

	toggle(field_x, field_y) {
		Dispatcher.emit(this.WORLD_FIELD_TOGGLE, field_x, field_y);
	}
};