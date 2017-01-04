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
			<div className="layout">
				<div className="header">
					<AppBar title="Cellular automaton" onLeftIconButtonTouchTap={() => this.openMenuHandler()}/>
				</div>
				
				<Menu/>

				<div className="content">
					<div className='controllers'>
						<div className='simulate'>
							<SimulateCtrls />
						</div>
					</div>
					<WorldMap />
				</div>
				
			</div>
		);
	}
}