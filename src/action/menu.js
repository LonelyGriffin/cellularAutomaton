import Dispatcher from 'service/dispatcher';

const MenuAction = {
	OPEN: 'MENU_OPEN',
	CLOSE: 'MENU_CLOSE',
	CHANGE_SETTING_WIDTH: 'MENU_CHANGE_SETTING_WIDTH',
	CHANGE_SETTING_HEIGHT: 'MENU_CHANGE_SETTING_HEIGHT',
	CHANGE_SETTING_VERTICAL_FIXATION: 'MENU_CHANGE_SETTING_VERTICAL_FIXATION',
	CHANGE_SETTING_HORIZONTAL_FIXATION: 'MENU_CHANGE_SETTING_HORIZONTAL_FIXATION',
	APPLY_WORLD_SETTINGS: 'MENU_APPLY_WORLD_SETTINGS',
	CHANGE_SETTING_TYPE: 'CHANGE_SETTING_TYPE',

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
		verticalFixation() {
			Dispatcher.fire(MenuAction.CHANGE_SETTING_VERTICAL_FIXATION);
		},
		horizontalFixation() {
			Dispatcher.fire(MenuAction.CHANGE_SETTING_HORIZONTAL_FIXATION);
		},
		type(newType) {
			Dispatcher.fire(MenuAction.CHANGE_SETTING_TYPE, newType);
		},
	},
	applyWorldSettings(settings) {
		Dispatcher.fire(MenuAction.APPLY_WORLD_SETTINGS, settings);
	},
};
export default MenuAction;
