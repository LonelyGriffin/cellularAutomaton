import React from 'react';
import AppBar from 'material-ui/AppBar';
import MenuAction from 'action/menu';
import Menu from 'app/menu/menu';

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}
	openMenuHandler(){
		MenuAction.openMenu();
	}
	render() {
		return (
			<div>
				<AppBar title="Cellular automaton" onLeftIconButtonTouchTap={() => this.openMenuHandler()}/>
				<Menu/>
			</div>
		);
	}
}