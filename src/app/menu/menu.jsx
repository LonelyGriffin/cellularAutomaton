import React from 'react';
import MenuAction from 'action/menu';
import menuStore from 'store/menu';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			opened: false
		};

		menuStore.addListener((state) => {
			this.setState({
				opened: state.opened
			});
		});
	}
	closeMenuHandler(){
		MenuAction.close();
	}
	render() {
		return (
			<Drawer width={600}
					docked={false} 
					openSecondary={true} 
					open={this.state.opened} 
					onRequestChange={() => this.closeMenuHandler()}>
				<AppBar showMenuIconButton={false} title="Settings" />
			</Drawer>
		);
	}
}