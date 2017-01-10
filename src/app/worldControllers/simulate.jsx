import React from 'react';
import Play from 'material-ui/svg-icons/av/play-arrow';
import Pause from 'material-ui/svg-icons/av/pause';
import Replay from 'material-ui/svg-icons/av/replay';
import Stop from 'material-ui/svg-icons/av/stop';
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
			});
		});
	}

	state = {
		isLaunched: false,
		isFirstFrame: true,
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

	render() {
		return (
			<div>
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
