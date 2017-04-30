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
  componentDidMount() {
      let ctx = this.canvas.getContext('2d');

      ctx.fillStyle = 'rgb(200,0,0)';
      ctx.fillRect(10, 10, 55, 50);
  }

  render() {
    // let cells = _.map(_.range(8), (c) => <LEDCell key={c} {...this.props} col={c} />);
    return (
      <div style={{width: "200px", height: "200px", background: "blue"}}>
        <canvas ref={(c) => { this.canvas = c; }} />
      </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    let ixs = _.range(8);
    this.state = {
      values: _.map(ixs, (i) => 2*i)
    };
  }

  onLEDClick = (r, c) => {
    let newValues = _.clone(this.state.values);
    newValues[r] ^= (1 << c);
    this.setState({values: newValues});
  }

  onHexChange = (e) => {
    console.log(e);
    console.log(e.target.value);
  }

  toHexString() {
    let reversedValues = _.clone(this.state.values).reverse();
    return _.map(reversedValues, (x) => ('0' + x.toString(16)).substr(-2)).join("");
  }

  render() {
    let rows = _.map(_.range(8), (r) => <LEDRow key={r} row={r} byte={this.state.values[r]} onClick={this.onLEDClick} />);
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
        <MatrixPreview />
      </div>
    );
  }
}

export default App;
