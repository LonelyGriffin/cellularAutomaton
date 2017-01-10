import Dispatcher from 'service/dispatcher';

const MenuAction = {
	OPEN: 'MENU_OPEN',
	CLOSE: 'MENU_CLOSE',
	CHANGE_SETTING_WIDTH: 'MENU_CHANGE_SETTING_WIDTH',
	CHANGE_SETTING_HEIGHT: 'MENU_CHANGE_SETTING_HEIGHT',
	APPLY_WORLD_SETTINGS: 'MENU_APPLY_WORLD_SETTINGS',

	open() {
		Dispatcher.fire(MenuAction.OPEN);
	},
	close() {
		Dispatcher.fire(MenuAction.CLOSE);
	},
	changeSetting: {
		width(newWidth, hardValidation) {
			Dispatcher.fire(MenuAction.CHANGE_SETTING_WIDTH, newWidth, hardValidation);
		},
		height(newHeight, hardValidation) {
			Dispatcher.fire(MenuAction.CHANGE_SETTING_HEIGHT, newHeight, hardValidation);
		},
	},
	applyWorldSettings(settings) {
		Dispatcher.fire(MenuAction.APPLY_WORLD_SETTINGS, settings);
	},
};
export default MenuAction;
