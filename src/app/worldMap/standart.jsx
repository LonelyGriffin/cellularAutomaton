import React from 'react';
import 'app/worldMap/standart.less';
import worldStore from 'store/world';
import WorldAction from 'action/world';

const getInitialState = () => {
	const state = worldStore.getState();

	return {
		width: state.width,
		height: state.height,
		fields: state.fields,
	};
};

export default class StandartMap extends React.Component {
	static propTypes = {
		tileSize: React.PropTypes.number,
	}
	static defaultProps = {
		tileSize: 10,
	}

	constructor(props) {
		super(props);

		worldStore.addListener((state) => {
			this.setState({
				width: state.width,
				height: state.height,
				fields: state.fields,
			});
		});

		this.clickLayerHandler = this.clickLayerHandler.bind(this);
	}

	state = getInitialState();

	componentDidMount() {
		this.updateFieldsCanvas();
		this.updateGridCanvas();
	}
	componentDidUpdate(prevProps, prevState) {
		this.updateFieldsCanvas();
		if (this.state.width !== prevState.width || this.state.height !== prevState.height) {
			this.updateGridCanvas();
		}
	}

	getGridSize() {
		return {
			height: this.props.tileSize * this.state.height,
			width: this.props.tileSize * this.state.width,
		};
	}

	updateGridCanvas() {console.log('update');
		const gridSize = this.getGridSize();
		const ctx = this.gridCanvas.getContext('2d');
		const dbCanvas = document.createElement('canvas');
		dbCanvas.width = gridSize.width;
		dbCanvas.height = gridSize.height;
		const dbCtx = dbCanvas.getContext('2d');
		dbCtx.beginPath();
		dbCtx.lineWidth = 0.5;
		dbCtx.strokeStyle = 'gray';
		for (let x = 1; x < gridSize.width - 1; x++) {
			dbCtx.moveTo(x * this.props.tileSize, 0);
			dbCtx.lineTo(x * this.props.tileSize, gridSize.height);
		}
		for (let y = 1; y < gridSize.height - 1; y++) {
			dbCtx.moveTo(0, y * this.props.tileSize);
			dbCtx.lineTo(gridSize.width, y * this.props.tileSize);
		}
		dbCtx.stroke();
		dbCtx.beginPath();
		dbCtx.lineWidth = 0.5;
		dbCtx.strokeStyle = 'black';
		dbCtx.rect(0, 0, gridSize.width, gridSize.height);
		dbCtx.stroke();
		ctx.clearRect(0, 0, gridSize.width, gridSize.height);
		ctx.drawImage(dbCanvas, 0, 0);
	}

	updateFieldsCanvas() {
		const gridSize = this.getGridSize();
		const tileSize = this.props.tileSize;
		const ctx = this.fieldsCanvas.getContext('2d');
		const dbCanvas = document.createElement('canvas');
		dbCanvas.width = gridSize.width;
		dbCanvas.height = gridSize.height;
		const dbCtx = dbCanvas.getContext('2d');
		this.state.fields.forEach((field, point) => {
			dbCtx.fillStyle = 'black';
			dbCtx.fillRect(point.x * tileSize, point.y * tileSize, tileSize, tileSize);
		});
		ctx.clearRect(0, 0, gridSize.width, gridSize.height);
		ctx.drawImage(dbCanvas, 0, 0);
	}

	clickLayerHandler = (e) => {
		const event = e.nativeEvent;
		const point = {
			x: Math.floor(event.offsetX / this.props.tileSize),
			y: Math.floor(event.offsetY / this.props.tileSize),
		};

		WorldAction.set(point, worldStore.createField({ isLive: !worldStore.getField(point).isLive }));
	}

	render() {
		const gridSize = this.getGridSize();
		const mapStyle = {
			width: `${gridSize.width}px`,
			height: `${gridSize.height}px`,
		};
		return (
			<div onClick={this.clickLayerHandler} style={mapStyle} className="map" >
				<canvas className="canvas" ref={(c) => { this.fieldsCanvas = c; }} width={gridSize.width} height={gridSize.height} />
				<canvas className="canvas" ref={(c) => { this.gridCanvas = c; }} width={gridSize.width} height={gridSize.height} />
			</div>
		);
	}
}
