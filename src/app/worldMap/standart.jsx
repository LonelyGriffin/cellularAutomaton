import React from 'react';
import {Layer, Rect, Stage, Line} from 'react-konva';
import worldStore from 'store/world';
import WorldAction from 'action/world';

export default class StandartMap extends React.Component {
	static get defaultProps() {
		return {
			tileSize: 10
		}
	}
	constructor(props) {
		super(props);

		let state = worldStore.getState();

		this.state = {
			width: state.width,
			height: state.height,
			fields: state.fields
		}

		worldStore.addListener((state) => {
			this.setState({
				width: state.width,
				height: state.height,
				fields: state.fields
			});
		});
	}

	clickLayerHandler(e){
		let event = e.nativeEvent,
			field_x = Math.floor( event.offsetX / this.props.tileSize ),
			field_y = Math.floor( event.offsetY / this.props.tileSize );

		WorldAction.toggle(field_x, field_y);
	}

	render() {

		let fields = [];

		for(let key in this.state.fields) {
			let field = this.state.fields[key];
			fields.push(
				<Rect key={key}
					x={ this.props.tileSize * field.x } y={ this.props.tileSize * field.y } 
					width={ this.props.tileSize } height={ this.props.tileSize }
					fill='black'
				/>
			);
		};

		let grid = [],
			gridHeight = this.props.tileSize * this.state.height,
			gridWidth = this.props.tileSize * this.state.width;

		for(let y = 0; y <= this.state.height; y++) {
			let y_px = y * this.props.tileSize;
			grid.push(
				<Line key={ 'h_line_' + y } 
					points= { [ 0, y_px, gridWidth, y_px ] }
					stroke='gray'
					strokeWidth='0.2'
				/>
			);
		}

		for(let x = 0; x <= this.state.width; x++) {
			let x_px = x * this.props.tileSize;
			grid.push(
				<Line key={ 'v_line_' + x } 
					points= { [ x_px , 0, x_px, gridWidth ] }
					stroke='gray'
					strokeWidth='0.2'
				/>
			);
		}


		return (
			<div onClick={ (e) => this.clickLayerHandler(e) } style={{ width: gridWidth + 'px', height: gridHeight + 'px' }}>
				<Stage width={ gridWidth } height={ gridHeight }>
					<Layer>
						{ fields }
						{ grid }
					</Layer>
				</Stage>
			</div>
		);
	}
}