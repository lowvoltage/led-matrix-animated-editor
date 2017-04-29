import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash' 

class LEDCell extends Component {
  onClick = () => {
    this.props.onClick(this.props.row, this.props.col);
  }

  render() {
    let clazz = this.props.byte & (1 << this.props.col) ? "active" : null;
    return <td className={clazz} onClick={this.onClick}> </td>;
  }
}

class LEDRow extends Component {
  render() {
    let cells = _.map(_.range(8), (c) => <LEDCell key={c} {...this.props} col={c} />);

    return (<tr> { cells } </tr>);
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
    // console.log(r, c);
    let newValues = _.clone(this.state.values);
    newValues[r] ^= (1 << c);
    this.setState({values: newValues});
  }

  render() {
    console.log(this.state.values);
    let rows = _.map(_.range(8), (r) => <LEDRow key={r} row={r} byte={this.state.values[r]} onClick={this.onLEDClick} />);
    let stateVal = _.map(this.state.values, (x) => ('0' + x.toString(16)).substr(-2));
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <table className="leds">
          <tbody>
            { rows }
          </tbody>
        </table>
        <div>
          { stateVal }
        </div>
      </div>
    );
  }
}

export default App;
