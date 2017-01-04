import Dispatcher from "service/dispatcher";
import { WORLD_START, WORLD_STOP, WORLD_RESET, WORLD_FIELD_TOGGLE } from "constant/world";

export default {
	start(){
		Dispatcher.emit(WORLD_START);

	},

	stop(){
		Dispatcher.emit(WORLD_STOP);
	},

	reset() {
		Dispatcher.emit(WORLD_RESET);
	},

	toggle(field_x, field_y) {
		Dispatcher.emit(WORLD_FIELD_TOGGLE, field_x, field_y);
	}
};