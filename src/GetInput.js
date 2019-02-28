import React, { Component } from 'react';
import firebase from './firebase.js';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

class GetInput extends Component{
    constructor(){
        super();
        this.state = {
            validInput: true,
            id: '',
            question: '',
            answer: ''
        };
    }

    //input change event handler
    handleChange = (event) => {
    // url format: https://stackoverflow.com/questions/40947650/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
    //use split to get the id from user's input
    const userInput = event.target.value;
    const inputArr = userInput.split('/');
    
    //store them in variable
    const inputId = inputArr[4];
    const inputQuestion = inputArr[5].split('-').join(' ') + '?';
    
    // update state
    this.setState({
        id: inputId,
        question: inputQuestion
    });
}

//axios
    getApi = (id) => {
    // https://api.stackexchange.com/2.2/questions/1026069/answers?site=stackoverflow&filter=withbody&sort=votes
        return axios({
            method:'GET',
            url: 'https://api.stackexchange.com/2.2/questions/' + id + '/answers',
            dataResponse: 'json',
            params: {
             'site': 'stackoverflow',
             'sort': 'votes',
             'filter': '!9Z(-wzftf'
            }
        })
        .then((res) => {
            return res.data.items[0].body_markdown;
        });
    }
    
//submit event handler
//call API, set state
    handleSubmit = (event) => {
        event.preventDefault();
        this.getApi(this.state.id)
        .then((string) => {
            this.setState({
                answer: string
            });
        });
    }

//confirm result, send to firebase
    handleConfirm = (event) => {
        event.preventDefault();
        const dbRef = firebase.database().ref();
        dbRef.push({
            question: this.state.question,
            answer: this.state.answer
        })
        this.setState({
            id: '',
            question: '',
            answer: '' 
        })
    }

    render(){
        // take user input from input, and submit input data with submit buttom
        return(
            <div className="getInput">
                <form action="submit" onSubmit={this.handleSubmit}>
                    <input type="text" name="question" placeholder='Please place stackoverflow url' onChange={this.handleChange}/>
                    <button type="submit">{'Show Q&A'}</button>
                </form>

                <section>
                    {
                        this.state.answer ? (
                            <div className="print">
                                <p>Question: </p>
                                <ReactMarkdown source={this.state.question} />
                                <p>Answer: </p>
                                <ReactMarkdown source={this.state.answer} />
                            </div>
                            ) : null
                    }
                    <button className="confirmButton" onClick={this.handleConfirm}>Add to my card deck!</button>
                </section>

                <button className="backButton" onClick={this.props.onBack}>Back</button>
            </div>
        );
    }
}

export default GetInput;