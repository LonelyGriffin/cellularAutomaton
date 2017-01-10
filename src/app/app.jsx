import React from 'react';
import AppBar from 'material-ui/AppBar';
import Menu from 'app/menu/menu';
import SimulateCtrls from 'app/worldControllers/simulate';
import WorldMap from 'app/worldMap/standart';
import MenuAction from 'action/menu';
import MenuStore from 'store/menu';

import 'app/app.less';

export default class App extends React.Component {
	openMenuHandler = () => {
		MenuAction.open();
	}
	render() {
		return (
			<div className="layout">
				<div className="header">
					<AppBar title="Cellular automaton" onLeftIconButtonTouchTap={this.openMenuHandler} />
				</div>
				<Menu store={MenuStore} action={MenuAction} />
				<div className="content">
					<div className="controllers">
						<div className="simulate">
							<SimulateCtrls />
						</div>
					</div>
					<WorldMap />
				</div>
			</div>
		);
	}
}
