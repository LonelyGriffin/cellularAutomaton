import React from 'react';
import MenuAction from 'action/menu';
import menuStore from 'store/menu';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import NumberInput from 'material-ui-number-input';

export default class App extends React.Component {

	constructor(props) {
		super(props);

		menuStore.addListener((state) => {
			this.setState({
				opened: state.opened,
			});
		});
	}
	state = {
		opened: false,
	}
	closeMenuHandler = () => {
		MenuAction.close();
	}
	render() {
		return (
			<Drawer
				width={600}
				docked={false}
				openSecondary
				open={this.state.opened}
				onRequestChange={this.closeMenuHandler}
			>
				<AppBar showMenuIconButton={false} title="Settings" />
				<div>
					<NumberInput
						name="worldWidth"
						strategy="ignore"
						required
						defaultValue={100}
						disabled
					/>
				</div>
			</Drawer>
		);
	}
}
