import React from 'react';
import { Layer, Rect, Stage, Line } from 'react-konva';
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

	clickLayerHandler = (e) => {
		const event = e.nativeEvent;
		const point = {
			x: Math.floor(event.offsetX / this.props.tileSize),
			y: Math.floor(event.offsetY / this.props.tileSize),
		};

		WorldAction.set(point, worldStore.createField({ isLive: !worldStore.getField(point).isLive }));
	}

	render() {
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
		const mapStyle = {
			width: `${gridWidth}px`,
			height: `${gridHeight}px`,
			border: '1px solid gray',
		};
		return (
			<div onClick={this.clickLayerHandler} style={mapStyle} >
				<Stage width={gridWidth} height={gridHeight}>
					<Layer>
						{fields}
						{grid}
					</Layer>
				</Stage>
			</div>
		);
	}
}
