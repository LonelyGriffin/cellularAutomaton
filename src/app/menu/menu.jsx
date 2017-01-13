import 'app/menu/menu.less';
import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class Menu extends React.Component {
	static propTypes = {
		store: React.PropTypes.object.isRequired,
		action: React.PropTypes.object.isRequired,
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
		this.changeVerticalFixationHandler = this.changeVerticalFixationHandler.bind(this);
		this.changeHorizontalFixationHandler = this.changeHorizontalFixationHandler.bind(this);
		this.changeWorldTypeHandler = this.changeWorldTypeHandler.bind(this);
	}
	closeMenuHandler = () => {
		this.props.action.applyWorldSettings(this.state.world);
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
	changeVerticalFixationHandler = () => {
		this.props.action.changeSetting.verticalFixation();
	}
	changeHorizontalFixationHandler = () => {
		this.props.action.changeSetting.horizontalFixation();
	}
	changeWorldTypeHandler = (e, i, value) => {
		this.props.action.changeSetting.type(value);
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
						<span className="action">
							<TextField
								name="worldWidth"
								value={this.state.world.width}
								onChange={this.changeWorldWidthHandler}
								onBlur={this.blurWorldWidthHandler}
							/>
						</span>
					</div>
					<div className="option-item">
						<span className="title">{'Height:'}</span>
						<span className="action">
							<TextField
								name="worldHeight"
								value={this.state.world.height}
								onChange={this.changeWorldHeightHandler}
								onBlur={this.blurWorldHeightHandler}
							/>
						</span>
					</div>
					<div className="option-item">
						<span className="title">{'Vertical fixation:'}</span>
						<span className="action">
							<Toggle
								toggled={this.state.world.verticalFixation}
								onToggle={this.changeVerticalFixationHandler}
							/>
						</span>
					</div>
					<div className="option-item">
						<span className="title">{'Horizontal fixation:'}</span>
						<span className="action">
							<Toggle
								toggled={this.state.world.horizontalFixation}
								onToggle={this.changeHorizontalFixationHandler}
							/>
						</span>
					</div>
					<div className="option-item">
						<span className="title">{'Type:'}</span>
						<span className="action">
							<SelectField
								value={this.state.world.type}
								onChange={this.changeWorldTypeHandler}
							>
								<MenuItem value={this.state.worldTypes.SQUERY} primaryText="Squery" />
								<MenuItem value={this.state.worldTypes.HEX} primaryText="Hex" />
							</SelectField>
						</span>
					</div>
				</div>
			</Drawer>
		);
	}
}
