import Dispatcher from "service/dispatcher";
import {MENU_OPEN, CLOSE_MENU} from "constant/menu";

export default {
	openMenu(){
		Dispatcher.emit(MENU_OPEN);
	},
	closeMenu(){
		Dispatcher.emit(CLOSE_MENU);
	}
};