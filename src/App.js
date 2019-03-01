import React, { Component } from 'react';
import GetInput from './GetInput';
import CardDeck from './CardDeck';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
library.add(faPlus)

class App extends Component {
  constructor(){
    super();
    this.state = {
      view: ''
    }
  }

  //set different views for different component
  //with the eventlistener on different button
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

  // working as props for the other 2 component to get back to the main page
  showOriginal = () => {
    this.setState({
      view: ''
    })
  }

  render() {
    //if the user click "my card" , go to card deck.
    //if the user click "add new" , go to new input page.
    if(this.state.view === 'submit'){
      return (<GetInput onBack={this.showOriginal}/>);
    } else if (this.state.view === 'deck'){
      return(<CardDeck onBack={this.showOriginal}/>);
    }else return(
      <div className="app">
        <h1 className="header">My Stack<span>OverFlow</span> Flash Cards</h1>
        <div className="buttonContainer">
          <button onClick={this.showDeck}>My Cards</button>
          <button onClick={this.showSubmit}>Add New <FontAwesomeIcon icon="plus" /></button>
        </div>
      </div>
    )
  }
}

export default App;