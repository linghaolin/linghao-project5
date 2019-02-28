import React, { Component } from 'react';
import GetInput from './GetInput';
import CardDeck from './CardDeck';

class App extends Component {
  constructor(){
    super();
    this.state = {
      view: ''
    }
  }

  showDeck = () => {
    this.setState({
      view:'deck'
    })
  }

  showSubmit = () => {
    this.setState({
      view:'submit'
    })
  }

  showOriginal = () => {
    this.setState({
      view: ''
    })
  }

  render() {
    if(this.state.view === 'submit'){
      return (<GetInput onBack={this.showOriginal}/>);
    } else if (this.state.view === 'deck'){
      return(<CardDeck onBack={this.showOriginal}/>);
    }else return(
      <div className="app">
        <h1 className="header">My StackOverFlow Flash Cards</h1>
        <button onClick={this.showDeck}>My Cards</button>
        <button onClick={this.showSubmit}>Add New</button>
      </div>
    )
  }
}

export default App;