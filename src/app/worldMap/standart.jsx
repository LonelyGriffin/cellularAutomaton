import React from 'react';
import { Layer, FastLayer, Rect, Stage, Line, RegularPolygon } from 'react-konva';
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
		this.clickHexLayerHandler = this.clickHexLayerHandler.bind(this);
	}

	state = getInitialState();

	clickLayerHandler = (e) => {
		const event = e.nativeEvent;
		const point = {
			x: Math.floor(event.offsetX / this.props.tileSize),
			y: Math.floor(event.offsetY / this.props.tileSize),
		};

		WorldAction.set(point, worldStore.createField({ isLive: !worldStore.getField(point).isLive }));
	}
	clickHexLayerHandler = (e) => {
		const event = e.nativeEvent;
		const hexRadius = this.props.tileSize * 0.6;
		const hexHeight = hexRadius * 2;
		const hexWidth = 0.5 * Math.sqrt(3) * hexHeight;
		const y = Math.floor(event.offsetY / (0.75 * hexHeight));
		const x = Math.floor(y % 2 === 0 ? event.offsetX / hexWidth - 0.5 : event.offsetX / hexWidth);
		const point = { x, y };
		WorldAction.set(point, worldStore.createField({ isLive: !worldStore.getField(point).isLive }));
	}

	renderSqueryMap() {
		const fields = [];

		this.state.fields.forEach((field, point) => fields.push(
			<Rect
				key={`${point.x}_${point.y}`}
				x={this.props.tileSize * point.x} y={this.props.tileSize * point.y}
				width={this.props.tileSize} height={this.props.tileSize}
				fill="black"
			/>,
		));

		const grid = [];
		const gridHeight = this.props.tileSize * this.state.height;
		const gridWidth = this.props.tileSize * this.state.width;

		for (let y = 0; y <= this.state.height; y++) {
			const yPx = y * this.props.tileSize;
			grid.push(
				<Line
					key={`h_line_${y}`}
					points={[0, yPx, gridWidth, yPx]}
					stroke="gray"
					strokeWidth="0.2"
				/>,
			);
		}

		for (let x = 0; x <= this.state.width; x++) {
			const xPx = x * this.props.tileSize;
			grid.push(
				<Line
					key={`v_line_${x}`}
					points={[xPx, 0, xPx, gridWidth]}
					stroke="gray"
					strokeWidth="0.2"
				/>,
			);
		}
		return (
			<div onClick={this.clickLayerHandler} style={{ border: '1px solid gray' }} >
				<Stage width={gridWidth} height={gridHeight}>
					<Layer>
						{fields}
						{grid}
					</Layer>
				</Stage>
			</div>
		);
	}
	renderHexMap() {
		const fields = [];
		const hexRadius = this.props.tileSize * 0.6;
		const hexHeight = hexRadius * 2;
		const hexWidth = 0.5 * Math.sqrt(3) * hexHeight;

		this.state.fields.forEach((field, point) => {
			const x = point.y % 2 === 0 ? hexWidth * (point.x + 1) : hexWidth * (point.x + 0.5);
			const y = point.y % 2 === 0 ? hexHeight * (point.y + 0.5) - Math.floor(point.y * 0.5) * 0.5 * hexHeight : hexHeight * (point.y + 0.25)  - Math.floor(point.y * 0.5) * 0.5 * hexHeight;
			fields.push(
				<RegularPolygon
					key={`${point.x}_${point.y}`}
					x={x} y={y}
					sides={6}
					radius={hexRadius}
					fill="black"
				/>,
			);
		});

		const grid = [];

		const gridHeight = this.state.height > 1 ? hexHeight * this.state.height - 0.25 * hexHeight * (this.state.height - 1) : hexHeight;
		const gridWidth = hexWidth * (this.state.width + 0.5);
		for (let y = 0; y < this.state.height; y++) {
			for (let x = 0; x < this.state.width; x++) {
				const xPx = y % 2 === 0 ? hexWidth * (x + 1) : hexWidth * (x + 0.5);
				const yPx = hexHeight * (0.75 * y + 0.5);
				grid.push(
					<RegularPolygon
						key={`${xPx}_${yPx}`}
						x={xPx} y={yPx}
						sides={6}
						radius={hexRadius}
						stroke="gray"
						strokeWidth="0.2"
					/>,
				);
			}
		}
		return (
			<div onClick={this.clickHexLayerHandler} >
				<Stage width={gridWidth} height={gridHeight}>
					<Layer>
						{fields}
					</Layer>
					<FastLayer>
						{grid}
					</FastLayer>
				</Stage>
			</div>
		);
	}
	render() {
		switch (this.state.type) {
		case worldStore.TYPE.SQUERY: return this.renderSqueryMap();
		case worldStore.TYPE.HEX: return this.renderHexMap();
		default: return this.renderSqueryMap();
		}
	}
}
