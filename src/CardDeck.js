import React, { Component } from 'react';
import firebase from './firebase.js';
import ReactMarkdown from 'react-markdown';
import Flipcard from '@kennethormandy/react-flipcard';
// import '@kennethormandy/react-flipcard/dist/Flipcard.css';

class CardDeck extends Component {
    constructor(){
        super();
        this.state = {
            cards: [],
            flipped: false
        }
    }

    componentDidMount() {
        const dbRef = firebase.database().ref();
        dbRef.on('value', res => {
            const newCard = [];
            const data = res.val();

            for(let key in data){
                newCard.push({
                    question: data[key].question,
                    answer: data[key].answer,
                    flipped: false
                })
            }

            this.setState({
                cards: newCard
            })

            console.log(this.state.cards);
        })
    }

    flipCard = (card) => {
        let cards = this.state.cards;
        let index = cards.indexOf(card);

        let newCard = {
            ...card,
            flipped: !card.flipped
        };

        cards[index] = newCard;

        this.setState({
            cards: cards
        });
    }

    render(){
        return(
            <div className="cardDeck">
            {
                this.state.cards.map((obj) => {
                    return(
                <Flipcard flipped={obj.flipped} onClick={e => this.flipCard(obj)}>
                    <ReactMarkdown source={obj.question} />
                    <ReactMarkdown source={obj.answer} />
                </Flipcard>
                    )
                })
            }

            <button className="backButton" onClick={this.props.onBack}>Back</button>
            </div>
        )
    }
}

export default CardDeck;
