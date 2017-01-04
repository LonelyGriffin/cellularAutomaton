import Dispatcher from "service/dispatcher";

export default {
	MENU_OPEN: 'MENU:OPEN',
	MENU_CLOSE: 'MENU:CLOSE', 

	open(){
		Dispatcher.emit(this.MENU_OPEN);
	},
	close(){
		Dispatcher.emit(this.MENU_CLOSE);
	}
};