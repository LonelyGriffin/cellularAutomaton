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
		type: state.type,
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
				type: state.type,
			});
		});

		this.clickLayerHandler = this.clickLayerHandler.bind(this);
	}

	state = getInitialState();

	componentDidMount() {
		this.updateFieldsCanvas();
		this.updateGridCanvas();
	}
	componentWillUpdate(nextProps, nextState) {
		if (this.state.width !== nextState.width ||
				this.state.height !== nextState.height ||
				this.state.type !== nextState.type) {
			this.cachedGridSize = undefined;
		}
	}
	componentDidUpdate(prevProps, prevState) {
		this.updateFieldsCanvas();
		if (this.state.width !== prevState.width ||
				this.state.height !== prevState.height ||
				this.state.type !== prevState.type) {
			this.updateGridCanvas();
		}
	}

	getGridSize() {
		if (!this.cachedGridSize) {
			switch (this.state.type) {
			default:
			case worldStore.TYPE.SQUERY:
				this.cachedGridSize = {
					height: this.props.tileSize * this.state.height,
					width: this.props.tileSize * this.state.width,
				};
				break;
			case worldStore.TYPE.HEX:
				this.cachedGridSize = {
					height: 0.75 * this.props.tileSize * (this.state.height + 0.5),
					width: Math.ceil(0.5 * Math.sqrt(3) * this.props.tileSize * (this.state.width + 0.5)),
				};
				break;
			}
		}
		return this.cachedGridSize;
	}

	getSqueryGridImg() {
		const gridSize = this.getGridSize();
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
		return dbCanvas;
	}

	getHexGridImg() {
		const gridSize = this.getGridSize();
		const hexHeight = this.props.tileSize;
		const hexWidth = 0.5 * Math.sqrt(3) * this.props.tileSize;
		const dbCanvas = document.createElement('canvas');
		dbCanvas.width = gridSize.width;
		dbCanvas.height = gridSize.height;
		const dbCtx = dbCanvas.getContext('2d');
		dbCtx.beginPath();
		dbCtx.lineWidth = 0.5;
		dbCtx.strokeStyle = 'gray';
		let i = 0;
		let x = hexWidth / 2;
		let y = hexHeight / 4;
		dbCtx.moveTo(x, y);
		for (let j = 0; j < this.state.height; j++) {
			for(let i = 0; i < this.state.width; i++) {
				dbCtx.moveTo(x, y + hexHeight / 2);
				dbCtx.lineTo(x, y);
				dbCtx.lineTo(x + hexWidth / 2, y - hexHeight / 4);
				x += hexWidth;
				dbCtx.lineTo(x, y);
			}
			y += 3 * hexHeight / 4;
			x = j % 2 !== 0 ? hexWidth / 2 : 0;
		}
		dbCtx.stroke();
		dbCtx.beginPath();
		dbCtx.lineWidth = 0.5;
		dbCtx.strokeStyle = 'black';
		i = 0;
		x = hexWidth / 2;
		y = hexHeight / 4;
		dbCtx.moveTo(x, y);
		while (i < this.state.width) {
			dbCtx.lineTo(x + hexWidth / 2, 0);
			dbCtx.lineTo(x + hexWidth, y);
			x += hexWidth;
			i++;
		}
		y += hexWidth / 2;
		dbCtx.lineTo(x, y);
		x -= hexWidth / 2;
		y += hexWidth / 4;
		dbCtx.lineTo(x, y);
		i = 1;
		while (i < this.state.height) {
			if (i % 2 === 0) {
				dbCtx.lineTo(x + hexWidth / 2, y + hexHeight / 4);
				dbCtx.lineTo(x + hexWidth / 2, y + 3 * hexHeight / 4);
				dbCtx.lineTo(x, y + hexHeight);
				y += hexHeight;
			} else {
				y += hexHeight / 2;
				dbCtx.lineTo(x, y);
			}
			i++;
		}
		if (this.state.height % 2 === 0) {
			x -= hexWidth / 2;
			y += hexHeight / 4;
			dbCtx.lineTo(x, y);
		}
		i = this.state.width - 1;
		while (i > 0) {
			dbCtx.lineTo(x - hexWidth / 2, y - hexHeight / 4);
			dbCtx.lineTo(x - hexWidth, y);
			x -= hexWidth;
			i--;
		}
		if (this.state.height % 2 !== 0) {
			x -= hexWidth / 2;
			y -= hexHeight / 4;
			dbCtx.lineTo(x, y);
		}
		i = this.state.height;
		while (i > 0) {
			if (i % 2 === 0) {
				dbCtx.lineTo(x - hexWidth / 2, y - hexHeight / 4);
				dbCtx.lineTo(x - hexWidth / 2, y - 3 * hexHeight / 4);
				dbCtx.lineTo(x, y - hexHeight);
				y -= hexHeight;
			} else {
				y -= hexHeight / 2;
				dbCtx.lineTo(x, y);
			}
			i--;
		}
		dbCtx.stroke();
		return dbCanvas;
	}

	getSqueryFieldsImg() {
		const gridSize = this.getGridSize();
		const tileSize = this.props.tileSize;
		const dbCanvas = document.createElement('canvas');
		dbCanvas.width = gridSize.width;
		dbCanvas.height = gridSize.height;
		const dbCtx = dbCanvas.getContext('2d');
		this.state.fields.forEach((field, point) => {
			dbCtx.fillStyle = 'black';
			dbCtx.fillRect(point.x * tileSize, point.y * tileSize, tileSize, tileSize);
		});
		return dbCanvas;
	}

	getHexFieldsImg() {
		const gridSize = this.getGridSize();
		const hexHeight = this.props.tileSize;
		const hexWidth = 0.5 * Math.sqrt(3) * this.props.tileSize;
		const dbCanvas = document.createElement('canvas');
		dbCanvas.width = gridSize.width;
		dbCanvas.height = gridSize.height;
		const dbCtx = dbCanvas.getContext('2d');
		this.state.fields.forEach((field, point) => {
			const x = point.y % 2 === 0 ? hexWidth * (point.x + 0.5) : hexWidth * point.x;
			const y = hexHeight * (0.75 * point.y + 0.25);
			dbCtx.beginPath();
			dbCtx.fillStyle = 'black';
			dbCtx.lineTo(x + hexWidth / 2, y - hexHeight / 4);
			dbCtx.lineTo(x + hexWidth, y);
			dbCtx.lineTo(x + hexWidth, y + hexHeight / 2);
			dbCtx.lineTo(x + hexWidth / 2, y + 3 * hexHeight / 4);
			dbCtx.lineTo(x, y + hexHeight / 2);
			dbCtx.lineTo(x, y);
			dbCtx.fill();
		});
		return dbCanvas;
	}

	updateGridCanvas() {
		const gridSize = this.getGridSize();
		// this.gridCanvas.width = gridSize.width;
		// this.gridCanvas.height = gridSize.height;
		const ctx = this.gridCanvas.getContext('2d');
		let gridImg;
		switch (this.state.type) {
		default:
		case worldStore.TYPE.SQUERY:
			gridImg = this.getSqueryGridImg();
			break;
		case worldStore.TYPE.HEX:
			gridImg = this.getHexGridImg();
			break;
		}
		ctx.clearRect(0, 0, gridSize.width, gridSize.height);
		ctx.drawImage(gridImg, 0, 0);
	}

	updateFieldsCanvas() {
		const gridSize = this.getGridSize();
		const ctx = this.fieldsCanvas.getContext('2d');
		let fieldsImg;
		switch (this.state.type) {
		default:
		case worldStore.TYPE.SQUERY:
			fieldsImg = this.getSqueryFieldsImg();
			break;
		case worldStore.TYPE.HEX:
			fieldsImg = this.getHexFieldsImg();
			break;
		}
		ctx.clearRect(0, 0, gridSize.width, gridSize.height);
		ctx.drawImage(fieldsImg, 0, 0);
	}

	clickLayerHandler = (e) => {
		const event = e.nativeEvent;
		let point;
		switch (this.state.type) {
		default:
		case worldStore.TYPE.SQUERY:
			point = {
				x: Math.floor(event.offsetX / this.props.tileSize),
				y: Math.floor(event.offsetY / this.props.tileSize),
			};
			break;
		case worldStore.TYPE.HEX:
			const hexHeight = this.props.tileSize;
			const hexWidth = 0.5 * Math.sqrt(3) * hexHeight;
			const y = Math.floor(event.offsetY / (0.75 * hexHeight));
			const x = Math.floor(y % 2 === 0 ? event.offsetX / hexWidth - 0.5 : event.offsetX / hexWidth);
			point = { x, y };
			break;
		}

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
