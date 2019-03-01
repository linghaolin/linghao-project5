import React, { Component } from 'react';
import firebase from './firebase.js';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import './GetInput.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faBackward } from '@fortawesome/free-solid-svg-icons'
library.add(faPlus)
library.add(faBackward)

class GetInput extends Component{
    constructor(){
        super();
        this.state = {
            url: '',
            validInput: true,
            id: '',
            question: '',
            answer: ''
        };
    }

// step1, put event handler on input, so the state will listen to the changes of user input.
    handleChange = (event) => {
    const userInput = event.target.value;
    
    // update state
    this.setState({
        url: userInput
    });
}

// step2: click submit button, trigger event handler
//call API, set state on answers
handleSubmit = (event) => {
    console.log("submit");
    
    event.preventDefault();
    
    //split the url to get the information that's needed to call API
    // url format: https://stackoverflow.com/questions/22639296/force-mobile-browser-zoom-out-with-javascript?noredirect=1&lq=1
    let inputArr = this.state.url;
    inputArr = inputArr.split('/');
    
    //store id in variable
    const inputId = inputArr[4];
    
    //step5: call api, to get the question
    //store the result in state
    this.getQuestionTitle(inputId)
        .then((title) => {
            this.setState({
                id: inputId,
                question: title
            });
        });
    
    //step6: call api, to get the answer
     //store the result in state
    this.getAnswerBody(inputId)
    .then((string) => {
        this.setState({
            answer: string,
            url: ''
        });
    });
}

// Step3: call API with the id from user input
//questions api is different from answers api, so it should be called seperately.
//.title is where the questions body stored 
    getQuestionTitle = (id) => {
        // https://api.stackexchange.com/2.2/questions/1026069/answers?site=stackoverflow&filter=withbody&sort=votes
        return axios({
            method: 'GET',
            url: 'https://api.stackexchange.com/2.2/questions/' + id + '',
            dataResponse: 'json',
            params: {
                'site': 'stackoverflow',
                'sort': 'votes',
                'filter': '!9Z(-wzftf'
            }
        })
            .then((res) => {
                return res.data.items[0].title;
            });
    }

//step4: call API tp get the answer related to the target question
//passing the id come from submit function into API call function, to get the highest voted answer from target question
//.body_markdown is where the answers stored.
    getAnswerBody = (id) => {
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

//step7: print the result on page, to let user to confirm result, click confirm button, send the data from state to firebase
    handleConfirm = (event) => {
        event.preventDefault();
        const dbRef = firebase.database().ref();
        dbRef.push({
            question: this.state.question,
            answer: this.state.answer
        })
        //clear state
        this.setState({
            id: '',
            question: '',
            answer: '' 
        })
    }

    render(){
        // step8: take user input, and submit input data with submit buttom
        // call API with userinput.
        // print the result on page
        return(
            <div className="getInput">
                <h1>Copy paste your stack<span>overflow</span> link here</h1>
                <form action="submit" onSubmit={this.handleSubmit}>
                    <input type="text" name="question" placeholder='Please place stackoverflow url' onChange={this.handleChange} value={this.state.url}/>
                    <button className="showButton" type="submit">{'Show Q&A'}</button>
                </form>
            
                <section>
                    {
                        this.state.answer ? (
                            <div className="print">
                                <p className="title">Question: </p>
                                <ReactMarkdown source={this.state.question} />
                                <p className="title">Answer: </p>
                                <ReactMarkdown source={this.state.answer} />
                            </div>
                            ) : null
                    }
                    <button className="confirmButton" onClick={this.handleConfirm}>Add to my card deck! <FontAwesomeIcon icon="plus" /></button>
                </section>

                <button className="backButton" onClick={this.props.onBack}>Back <FontAwesomeIcon icon="backward" /></button>
            </div>
        );
    }
}

export default GetInput;