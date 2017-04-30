import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash';

class LEDCell extends Component {
  onClick = () => {
    this.props.onClick(this.props.row, this.props.col);
  }

  render() {
    let clazz = "led-cell ";
    clazz += this.props.byte & (1 << this.props.col) ? "active" : "";
    return <td className={clazz} onClick={this.onClick}> </td>;
  }
}

class LEDRow extends Component {
  render() {
    let cells = _.map(_.range(8), (c) => <LEDCell key={c} {...this.props} col={c} />);
    return <tr>{ cells }</tr>;
  }
}

class MatrixPreview extends Component {
  width = 120;
  height = 120;

  componentDidMount() {
    this.redraw();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.value !== prevProps.value) {
      this.redraw();
    }
  }

  redraw() {
    let ctx = this.canvas.getContext('2d');

    for (let r = 0; r < 8; ++r) {
      for (let c = 0; c < 8; ++c) {
        let active = this.props.value[r] & (1 << c);
        ctx.fillStyle = active ? 'rgb(200,0,0)' : 'white';
        let x = (c + 0.5) * this.width / 8;
        let y = (r + 0.5) * this.height / 8;
        ctx.beginPath();
        ctx.arc(x, y, this.width / 16 - 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  render() {
    let clazz = "preview-matrix " + (this.props.selected ? "selected" : "");
    return (
      <div className={clazz}>
        <canvas id={this.props.id} ref={(c) => { this.canvas = c; }} height={this.height} width={this.width} onClick={this.props.onClick} />
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    let ixs = _.range(8);
    this.state = {
      values: _.map([0, 1, 2], () =>
        _.map(ixs, (i) => Math.floor((Math.random() * 100) + 1) )),
      currentFrame: 0,
    };
  }

  onLEDClick = (r, c) => {
    let newValues = _.clone(this.state.values);
    newValues[this.state.currentFrame] =  _.clone(this.state.values[this.state.currentFrame]);
    newValues[this.state.currentFrame][r] ^= (1 << c);
    this.setState({values: newValues});
  }

  onHexChange = (e) => {
    console.log(e);
    console.log(e.target.value);
  }

  onPreviewClick = (e) => {
    // TODO: Validate min-max
    this.setState({currentFrame: e.target.id});
  }

  toHexString() {
    let reversedValues = _.clone(this.state.values[this.state.currentFrame]).reverse();
    return _.map(reversedValues, (x) => ('0' + x.toString(16)).substr(-2)).join("");
  }

  render() {
    let rows = _.map(_.range(8), (r) => <LEDRow key={r} row={r} byte={this.state.values[this.state.currentFrame][r]} onClick={this.onLEDClick} />);
    let previews = _.map(this.state.values, (v, ix) => <MatrixPreview key={ix} id={ix} value={v} selected={ix==this.state.currentFrame} onClick={this.onPreviewClick} />);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <table className="led-matrix">
          <tbody>
            { rows }
          </tbody>
        </table>
        <div>
          { this.toHexString() }
        </div>
        Hex: <input type="text" defaultValue={this.toHexString()}  />
        {/*<MatrixPreview {...this.state.values[this.state.currentFrame]} />*/}
        <div className="previews">
          { previews }
        </div>
      </div>
    );
  }
}

export default App;
