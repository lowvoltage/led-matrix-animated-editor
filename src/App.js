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
    if (this.props.selected) {
      this.divElement.scrollIntoView(false);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.value !== prevProps.value) {
      this.redraw();
    }
    if (this.props.selected) {
      this.divElement.scrollIntoView(false);
    }
  }

  redraw() {
    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let r = 0; r < 8; ++r) {
      for (let c = 0; c < 8; ++c) {
        let active = this.props.value[r] & (1 << c);
        ctx.fillStyle = active ? 'rgb(200,0,0)' : 'white';
        let x = (c + 0.5) * this.width / 8;
        let y = (r + 0.5) * this.height / 8;
        ctx.beginPath();
        ctx.arc(x, y, Math.floor(this.width / 16), 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }

  render() {
    let clazz = "preview-matrix " + (this.props.selected ? "selected" : "");
    return (
      <div className={clazz} ref={(d) => { this.divElement = d; }}>
        <canvas id={this.props.id} ref={(c) => { this.canvas = c; }} height={this.height} width={this.width} onClick={this.props.onClick} />
        <label>Frame #{ this.props.id }</label>
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
        _.map(ixs, (i) => Math.floor((Math.random() * 255) + 1) )),
      currentFrame: 0,
      running: false,
    };
  }

  componentDidMount() {
    var intervalId = setInterval(this.onTimer, 500);
    // store intervalId in the state so it can be accessed later:
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  onTimer = () => {
    if (!this.state.running) {
      return;
    }

    let newFrame = this.state.currentFrame + 1;
    if (newFrame >= this.state.values.length) {
      newFrame = 0;
    }
    // setState method is used to update the state
    this.setState({ currentFrame: newFrame });
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
    this.setState({currentFrame: parseInt(e.target.id, 10)});
  }

  onAddFrameClick = (e) => {
    // TODO: Validate min-max
    let newValues = _.clone(this.state.values);
    let newIndex = this.state.currentFrame + 1;
    newValues.splice(newIndex, 0, Array(8).fill(0));
    this.setState({
        values: newValues,
        currentFrame: newIndex,
    });
  }

  onRemoveFrameClick = (e) => {
    // TODO: Validate min-max
    let newValues = _.clone(this.state.values);
    newValues.splice(this.state.currentFrame, 1);
    let newIndex = this.state.currentFrame;
    if (newIndex >= newValues.length) {
      newIndex = newValues.length - 1;
    }
    this.setState({
        values: newValues,
        currentFrame: newIndex,
    });
  }

  toHexString() {
    let reversedValues = _.clone(this.state.values[this.state.currentFrame]).reverse();
    return reversedValues.map( (x) => ('0' + x.toString(16)).substr(-2)).join("");
  }

  render() {
    let startStop = this.state.running ? 
      <button onClick={() => this.setState({running: false})}> Stop </button> : 
      <button onClick={() => this.setState({running: true})}> Start </button>;
    let addButton = <button onClick={this.onAddFrameClick}> + </button>;
    let removeButton = <button onClick={this.onRemoveFrameClick} disabled={this.state.values.length <= 1} > - </button>;
    let rows = _.map(_.range(8), (r) => <LEDRow key={r} row={r} byte={this.state.values[this.state.currentFrame][r]} onClick={this.onLEDClick} />);
    let previews = this.state.values.map( (v, ix) => <MatrixPreview key={ix} id={ix} value={v} selected={ix===this.state.currentFrame} onClick={this.onPreviewClick} />);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>8x8 LED Matrix Animated Editor</h2>
        </div>
        <table className="led-matrix">
          <tbody>
            { rows }
          </tbody>
        </table>
        <div>
          { startStop } { addButton } { removeButton }
        </div>
        <div>
          Hex: { this.toHexString() }
        </div>
        <div className="previews">
          { previews }
        </div>
      </div>
    );
  }
}

export default App;
