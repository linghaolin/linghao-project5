import React, { Component } from 'react';
import firebase from './firebase.js';
import ReactMarkdown from 'react-markdown';
import Flipcard from '@kennethormandy/react-flipcard';
import '@kennethormandy/react-flipcard/dist/Flipcard.css';
import './CardDeck.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBackward } from '@fortawesome/free-solid-svg-icons'
library.add(faBackward)

class CardDeck extends Component {
    constructor(){
        super();
        this.state = {
            cards: [],
            flipped: false,
            randomCard: {}
        }
    }
    //step1: fetch data from firebase
    componentDidMount() {
        const dbRef = firebase.database().ref();
        dbRef.on('value', res => {
            const cards = [];
            const data = res.val();
            // push into state
            for(let key in data){
                cards.push({
                    question: data[key].question,
                    answer: data[key].answer
                })
            }
            let randomCard = this.randomizeCard(cards);
            
            this.setState({
                cards: cards,
                randomCard: randomCard
            });
        })
    }
    
    // step2: event handler on next button, so user can switch card for next one
  
    randomizeCard = (cards) => {        
        // randomize the card to only show one
        const randomNum = Math.floor(Math.random() * this.state.cards.length);
        return cards[randomNum];
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if(this.state.cards.length > 2){
            this.setState({
                randomCard: this.randomizeCard(this.state.cards),
            });
        }
    }

    // step3：print the card on page
    render(){
        return(
            <div className="cardDeck">
                <h1>Click the <span>card</span> to check the answer</h1>
                <div className="flashCard">
        

                <Flipcard flipped={this.state.flipped} onClick={e => this.setState({ flipped: !this.state.flipped })}>
                    <ReactMarkdown source={this.state.randomCard.question} />
                    <ReactMarkdown source={this.state.randomCard.answer} />
                </Flipcard>
                
                <button className="nextButton" onClick={this.handleSubmit}>Next</button>
                <button className="backButton" onClick={this.props.onBack}>Back <FontAwesomeIcon icon="backward" /></button>
                </div>

            </div>
        )
    }
}

export default CardDeck;
