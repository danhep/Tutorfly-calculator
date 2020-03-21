import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
class CalcButton extends React.Component {
    render() {
        return (
            <button className="square" onClick={this.props.onClick}>
              {this.props.value}
            </button>
          );
    }
    

}

  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null)
          }
        ],
        stepNumber: 0,
        xIsNext: true,
        calcVal: "",
        display: "", 
        op1: "",
        op2: "",
        operator: ""
      };
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }
  
    evaluate() {
        const op1 = this.state.op1;
        const op2 = this.state.op2;
        const operator = this.state.operator;
        if (operator === "+") {
            this.setState({ display: Number(op1) + Number(op2),
            op1: (Number(op1) + Number(op2)).toString()
            });
        }
    
        else if (operator === "-") {
            this.setState({ display: Number(op1) - Number(op2),
              op1: (Number(op1) - Number(op2)).toString() });
        }
        else if (operator === "X") {
            this.setState({ display: Number(op1) * Number(op2),
              op1: (Number(op1) * Number(op2)).toString() });
        }
        else if (operator === "/") {
            this.setState({ display: Number(op1) / Number(op2),
              op1: (Number(op1) / Number(op2)).toString() });
        }
    }
    numPress(num) {
        const op1 = this.state.op1;
        const op2 = this.state.op2;
        const operator = this.state.operator
        if (operator === "" && op1 === "") {
          this.setState({op1: num,
          display: num})
        }
        else if (operator === "" && op1 !== "") {
          if (op1.includes(".") && num === ".") {
            this.setState({})
          }
          else {this.setState({op1: op1 + num,
          display: op1 + num})}
        }
        else if (op2 === "") {
          if (op2.includes(".") && num === ".") {
            this.setState({})
          }  
          else {this.setState({
                op2: op2 + num,
                display: op2 + num})}
        }
        else if (op2 !== "") {
          if (op2.includes(".") && num === ".") {
            this.setState({})
          }  
          else {this.setState({
                op2: op2 + num,
                display: op2 + num})}
        }
        
    }

    opPress(op) {
        this.setState({operator: op,
        op2: ""})
    }
    negative() {
      const op1 = this.state.op1;
      const op2 = this.state.op2; 
      if (op1 === "" && op2 === "") {
        this.setState({})
      }
      else if (this.state.display === op1){
        if (op1.includes("-")) {
          this.setState({
            op1: op1.replace("-", ""),
            display: op1.replace("-", "")
          })
        }
        else {this.setState({
          display: "-" + op1,
          op1: "-" + op1
        })}
      }
      else if (this.state.display === op2){
        if (op2.includes("-")) {
          this.setState({
            op2: op2.replace("-", ""),
            display: op2.replace("-", "")
          })
        }
        else {this.setState({
          display: "-" + op2,
          op1: "-" + op2
        })}
      }
    }
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }
    percent() {
      const display = this.state.display;
      const op1 = this.state.op1;
      const op2 = this.state.op2; 
      if (op1 === "" & op2 === "") {
        this.setState({
          
        })
      }
      else if (display === op1) {
        this.setState({
          op1: (Number(op1)/100).toString(),
          display: (Number(op1)/100).toString()
        })
      }
      else if (display === op2) {
        this.setState({
          op2: (Number(op2)/100).toString(),
          display: (Number(op2)/100).toString()
        })
      }
    }
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
  
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      let status;
      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
  
      return (
        <div>
            <div className="game">
                <div className="game-board">
                    <Board
                    squares={current.squares}
                    onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
            <div className="calc">
                <p>

                    {`My calculator ${this.state.display}`}
                </p>
                <div> 
                <CalcButton
                    value={'C'}
                    onClick={() => {this.setState({
                        op1: "",
                        op2: "",
                        operator: "",
                        display: ""
                    })}}
                    />
                <CalcButton
                    value={'+/-'}
                    onClick={() => this.negative()}
                    />
                <CalcButton
                    value={"%"}
                    onClick={() => this.percent()}
                    />
                <CalcButton
                    value={"/"}
                    onClick={() => this.opPress("/")}
                    />
                </div>
                <div> 
                <CalcButton
                    value={7}
                    onClick={() => this.numPress("7")}
                    />
                <CalcButton
                    value={8}
                    onClick={() => this.numPress("8")}
                    />
                <CalcButton
                    value={9}
                    onClick={() => this.numPress("9")}
                    />
                <CalcButton
                    value={"X"}
                    onClick={() => this.opPress("X")}
                    />
                </div>
                <div> 
                <CalcButton
                    value={4}
                    onClick={() => this.numPress("4")}
                    />
                <CalcButton
                    value={5}
                    onClick={() => this.numPress("5")}
                    />
                <CalcButton
                    value={6}
                    onClick={() => this.numPress("6")}
                    />
                <CalcButton
                    value={"-"}
                    onClick={() => this.opPress("-")}
                    />
                </div>
                <div> 
                <CalcButton
                    value={1}
                    onClick={() => this.numPress("1")}
                    />
                <CalcButton
                    value={2}
                    onClick={() => this.numPress("2")}
                    />
                <CalcButton
                    value={3}
                    onClick={() => this.numPress("3")}
                    />
                <CalcButton
                    value={"+"}
                    onClick={() => this.opPress("+")}
                    />
                </div>
                <div> 
                <CalcButton
                    value={0}
                    onClick={() => this.numPress("0")}
                    />
                <CalcButton
                    value={"."}
                    onClick={() => this.numPress(".")}
                    />
                <CalcButton
                    value={"="}
                    onClick={() => this.evaluate()}
                    />
                </div>
                    

            </div>


        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  