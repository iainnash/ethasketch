import React, { Component } from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import ReactCursorPosition from 'react-cursor-position';
import { abi } from './plotter.abi';
import './App.css';

const QueryLines = gql`
query allPosts {
  lineSets(last: 20) {
    id
    x
    y
    p
  }
}
`;

function clampAndParse(coord) {
  let c = parseInt(coord);
  if (c < 0) {
    return 0;
  }
  if (c > 1000) {
    return 1000;
  }
  return c;
}

function transformLines(lines) {
  let currentLine = 0;
  let lastLine = 0;
  const out = [];
  while (++currentLine < lines.x.length) {
    out.push({
      fromX: clampAndParse(lines.x[lastLine]),
      toX: clampAndParse(lines.x[currentLine]),
      fromY: clampAndParse(lines.y[lastLine]),
      toY: clampAndParse(lines.y[currentLine]),
      on: lines.p[currentLine],
    });
    lastLine = currentLine;
  }
  return out;
}

class LineNode extends Component {
  delete = (evt) => {
    evt.preventDefault();
    this.props.delete(this.props.index);
  }
  render() {
    return <line onClick={this.delete} {...this.props} />;
  }
}

class SVGRenderer extends Component {
  state = {
    startNode: null,
  };

  escFunction = (evt) => {
    if (evt.keyCode === 27) {
      this.setState({ startNode: null });
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.escFunction, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escFunction, false);
  }


  startPoint = () => {
    if (this.state.startNode) {
      const newNode = { x1: this.state.startNode.x, x2: this.props.position.x, y1: this.state.startNode.y, y2: this.props.position.y };
      this.setState({ startNode: null });
      this.props.addTempNode(newNode);
      return;
    }
    this.setState({ startNode: this.props.position });
  }

  removeNode = (indx) => {
    // this.setState({ tempNodes: this.state.tempNodes.filter((tempNode, i) => i == indx), startNode: null });
  }

  render() {
    return (
      <svg className="canvas" onClick={this.startPoint} style={{ width: '800px', height: '600px' }}>
        {this.props.data.lineSets.map((lineSet) => transformLines(lineSet).map((line, i) => (
          <line key={`${lineSet.id}-${i}`} x1={line.fromX} y1={line.fromY} x2={line.toX} y2={line.toY} style={{ stroke: 'blue', strokeWidth: 3 }} />
        )))}
        {this.state.startNode && (
          <line key="start" x1={this.state.startNode.x} x2={this.props.position.x} y1={this.state.startNode.y} y2={this.props.position.y} style={{ stroke: 'red', strokeWidth: 3 }} />
        )}
        {this.props.tempNodes.map((tempNode, i) => (
          <LineNode delete={this.removeNode} index={i} key={`temp${i}`} x1={tempNode.x1} x2={tempNode.x2} y1={tempNode.y1} y2={tempNode.y2} style={{ stroke: 'green', strokeWidth: 3 }} />
        ))}
      </svg>
    );
  }
}

class App extends Component {
  state = { nodes: [] };

  addTempNode = (tempNode) => {
    this.setState({ nodes: this.state.nodes.concat(tempNode) });
  }

  start = (evt) => {
    evt.preventDefault();

    // Create contract object
    const contractAddress = '0x21B1dDc150bF8589f3200BeAff1bFD8e77b201D5';

    // Create contract object
    const contract = window.web3.eth.contract(abi);

    // Instantiate contract
    const contractInstance = contract.at(contractAddress);

    const aryX = [];
    const aryY = [];
    const aryPlot = [];
    this.state.nodes.forEach((anode) => {
      console.log('has ndoe', anode);
      aryX.push(anode.x1);
      aryX.push(anode.x2);
      aryY.push(anode.y1);
      aryY.push(anode.y2);
      aryPlot.push(true);
      aryPlot.push(true);
    });

    // Get user account wallet address first
    window.web3.eth.getAccounts((error, accounts) => {
      if (error) throw error;
      // Make the contract call.
      contractInstance.drawLines.sendTransaction(
        aryX,
        aryY,
        aryPlot,
        { from: accounts[0] },
        (err, txnHash) => {
          this.setState({ nodes: [] });
          console.log(err, txnHash);
          this.props.data.refetch();
        });
    });
  }

  startPoint = (evt) => {
  }

  componentDidMount() {
    this.props.data.startPolling(4000);
  }

  render() {
    return (
      <div className="App">
        <h1>EthaSketch</h1>
        <div>
          {this.props.data.loading ? (<span>loading</span>) : (
            <ReactCursorPosition>
              <SVGRenderer addTempNode={this.addTempNode} tempNodes={this.state.nodes} data={this.props.data} />
            </ReactCursorPosition>
          )}
        </div>
        <button class="go" onClick={this.start}>Sketch on Blockchain</button>
      </div>
    );
  }
}

export default graphql(QueryLines)(App);
