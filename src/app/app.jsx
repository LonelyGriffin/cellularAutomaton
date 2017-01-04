import React from 'react';
import AppBar from 'material-ui/AppBar';
import MenuAction from 'action/menu';
import Menu from 'app/menu/menu';
import SimulateCtrls from 'app/worldControllers/simulate';
import WorldMap from 'app/worldMap/standart';

import 'app/app.less';

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}
	openMenuHandler(){
		MenuAction.open();
	}
	render() {
		return (
			<div>
				<AppBar title="Cellular automaton" onLeftIconButtonTouchTap={() => this.openMenuHandler()}/>
				<Menu/>
				<div className='controllers'>
					<div className='simulate'>
						<SimulateCtrls />
					</div>
				</div>
				<div>
					<WorldMap />
				</div>
			</div>
		);
	}
}