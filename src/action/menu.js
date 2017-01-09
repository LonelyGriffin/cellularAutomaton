import Dispatcher from 'service/dispatcher';

export default {
	OPEN: 'MENU:OPEN',
	CLOSE: 'MENU:CLOSE',

	open() {
		Dispatcher.fire(this.OPEN);
	},
	close() {
		Dispatcher.fire(this.CLOSE);
	},
};
