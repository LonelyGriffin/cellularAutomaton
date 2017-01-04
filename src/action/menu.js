import Dispatcher from "service/dispatcher";
import {MENU_OPEN, MENU_CLOSE} from "constant/menu";

export default {
	open(){
		Dispatcher.emit(MENU_OPEN);
	},
	close(){
		Dispatcher.emit(MENU_CLOSE);
	}
};