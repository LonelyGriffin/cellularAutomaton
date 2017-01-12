import React from 'react';
import Play from 'material-ui/svg-icons/av/play-arrow';
import Pause from 'material-ui/svg-icons/av/pause';
import Replay from 'material-ui/svg-icons/av/replay';
import Stop from 'material-ui/svg-icons/av/stop';
import Redo from 'material-ui/svg-icons/content/redo';
import Undo from 'material-ui/svg-icons/content/undo';
import IconButton from 'material-ui/IconButton';
import WorldAction from 'action/world';
import worldStore from 'store/world';

export default class SimulateCtrls extends React.Component {
	constructor(props) {
		super(props);

		worldStore.addListener((state) => {
			this.setState({
				isLaunched: state.isLaunched,
				isFirstFrame: state.isFirstFrame,
				historyLength: state.history.length,
			});
		});
	}

	state = {
		isLaunched: false,
		isFirstFrame: true,
		historyLength: 0,
	}

	playHandler = () => {
		WorldAction.start();
	}

	pauseHandler = () => {
		WorldAction.pause();
	}

	replayHandler = () => {
		WorldAction.reset();
	}

	stopHandler = () => {
		WorldAction.stop();
	}

	redoHandler = () => {
		WorldAction.redo();
	}

	undoHandler = () => {
		WorldAction.undo();
	}

	render() {
		return (
			<div>
				<IconButton onClick={this.undoHandler} className={this.state.isLaunched || this.state.historyLength === 0 ? 'hide' : ''} >
					<Undo />
				</IconButton>
				<IconButton onClick={this.redoHandler} className={this.state.isLaunched ? 'hide' : ''} >
					<Redo />
				</IconButton>
				<IconButton onClick={this.replayHandler} className={this.state.isLaunched ? 'hide' : ''} >
					<Replay />
				</IconButton>
				<IconButton onClick={this.stopHandler} className={this.state.isFirstFrame ? 'hide' : ''} >
					<Stop />
				</IconButton>
				<IconButton onClick={this.playHandler} className={this.state.isLaunched ? 'hide' : ''} >
					<Play />
				</IconButton>
				<IconButton onClick={this.pauseHandler} className={this.state.isLaunched ? '' : 'hide'} >
					<Pause />
				</IconButton>
			</div>
		);
	}
}
