import React from 'react';
import Play from 'material-ui/svg-icons/av/play-arrow';
import Pause from 'material-ui/svg-icons/av/pause';
import Replay from 'material-ui/svg-icons/av/replay';
import IconButton from 'material-ui/IconButton';
import WorldAction from 'action/world';
import worldStore from 'store/world';

export default class SimulateCtrls extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			launched: false
		}

		worldStore.addListener((state) => {
			this.setState({
				launched: state.launched
			});
		});
	}

	playHandler() {
		WorldAction.start();
	}

	pauseHandler() {
		WorldAction.stop();
	}

	replayHandler() {
		WorldAction.reset();
	}

	render() {
		return (
			<div>
				<IconButton onClick={ () => this.replayHandler() } className={ this.state.launched ? 'hide' : '' } >
					<Replay />
				</IconButton>
				<IconButton onClick={ () => this.playHandler() } className={ this.state.launched ? 'hide' : '' } >
					<Play />
				</IconButton>
				<IconButton onClick={ () => this.pauseHandler() } className={ this.state.launched ? '' : 'hide' } >
					<Pause />
				</IconButton>
			</div>
		);
	}
}