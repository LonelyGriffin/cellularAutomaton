import 'app/menu/menu.less';
import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

export default class Menu extends React.Component {
	static propTypes = {
		store: React.PropTypes.object.isRequired,
		action: React.PropTypes.object.isRequired,
	}
	static defaultProps = {
		tileSize: 10,
	}
	constructor(props) {
		super(props);

		this.state = this.props.store.getState();

		this.props.store.addListener((state) => {
			this.setState(state);
		});

		this.closeMenuHandler = this.closeMenuHandler.bind(this);
		this.changeWorldWidthHandler = this.changeWorldWidthHandler.bind(this);
		this.changeWorldHeightHandler = this.changeWorldHeightHandler.bind(this);
		this.blurWorldWidthHandler = this.blurWorldWidthHandler.bind(this);
		this.blurWorldHeightHandler = this.blurWorldHeightHandler.bind(this);
		this.applySettingsHandler = this.applySettingsHandler.bind(this);
	}
	closeMenuHandler = () => {
		this.props.action.close();
	}
	changeWorldWidthHandler = (e) => {
		this.props.action.changeSetting.width(e.target.value);
	}
	changeWorldHeightHandler = (e) => {
		this.props.action.changeSetting.height(e.target.value);
	}
	blurWorldWidthHandler = (e) => {
		this.props.action.changeSetting.width(e.target.value, true);
	}
	blurWorldHeightHandler = (e) => {
		this.props.action.changeSetting.height(e.target.value, true);
	}
	applySettingsHandler = () => {
		this.props.action.applyWorldSettings(this.state.world);
		this.props.action.close();
	}
	render() {
		const applyButton = <FlatButton label="Apply" onClick={this.applySettingsHandler} />;
		return (
			<Drawer
				className="menu"
				width={600}
				docked={false}
				openSecondary
				open={this.state.isOpened}
				onRequestChange={this.closeMenuHandler}
			>
				<AppBar
					showMenuIconButton={false}
					title="Settings"
					iconElementRight={applyButton}
				/>
				<div className="body">
					<div className="option-item">
						<span className="title">{'Width:'}</span>
						<TextField
							className="action"
							name="worldWidth"
							value={this.state.world.width}
							onChange={this.changeWorldWidthHandler}
							onBlur={this.blurWorldWidthHandler}Blur
						/>
					</div>
					<div className="option-item">
						<span className="title">{'Height:'}</span>
						<TextField
							className="action"
							name="worldHeight"
							value={this.state.world.height}
							onChange={this.changeWorldHeightHandler}
							onBlur={this.blurWorldHeightHandler}
						/>
					</div>
				</div>
			</Drawer>
		);
	}
}
