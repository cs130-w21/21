import React from 'react';
import ReactDOM from 'react-dom';
import TinderCard from 'react-tinder-card';
import Card from './Card';
import axios from "axios";
import {useHistory} from 'react-router-dom';

let state = 0; //0 = nomination, 1 = swipe, 2 = waiting to finish swiping, 3 = winner
let roomCode = "12345"
let cards = []
let cardResults = []
let currentIndex = 0
let roomHeader = "Do you like this option?"
let result = ""
let poll = true;
//TODO have server generate a room code instead

class SessionRoom extends React.Component {
    componentDidMount() {
        this.timer = setInterval(()=> this.roomFinishedVoting(), 3000);
    }

    handleToUpdate() { //This is called by child nomination component
        state = 1
        currentIndex = 0
        //GET request here to get list of all cards
        for(let i=cards.length-1; i > -1; i--){
            cardResults.push({name: cards[i], result: false})
        }
        this.forceUpdate();
    }
    swipeRight(){
        console.log("swiped right")
        cardResults[currentIndex].result = "True"
        currentIndex++
        if(currentIndex >= cardResults.length){
            this.doneVoting()
        }
    }
    swipeLeft(){
        console.log("swiped left")
        cardResults[currentIndex].result = "False"
        currentIndex++
        if(currentIndex >= cardResults.length){
            this.doneVoting()
        }
    }
    doneVoting(){
        console.log("done voting" + cardResults)
        state = 2
        //adding code here to retrieve results and display winner
        let dict = {}
        for(let i = 0; i<cardResults.length; i++){
            dict[cardResults[i].name] = cardResults[i].result
        }
        console.log(dict)
        try {
            console.log("Attempting to send swipe results");
            axios.post(
                'http://localhost:3000/option/results', 
                {roomCode: roomCode, results: dict}, 
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            ).then(res => {
                console.log(res);
                console.log("Successfully finished result post request")
            });
        } catch (err) {
            console.log(err);
            console.log("Failed to send results");
        }


        result = "Placeholder"
        this.forceUpdate()
    }

    roomFinishedVoting() {
        if(poll)
        {
            axios.get('http://localhost:3000/roomDoneVoting', {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }).then(res => {
                if(res.data.done)
                {
                    state = 3;
                    poll = false;
                    this.forceUpdate();
                }
            });
        }
    }

    getVotingResults() {
        try {
            axios.get("http://localhost:3000/room", {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }).then(res => {
                console.log(res)
                return res;
            });
        } catch (err) {
            console.log(err);
            console.log("Failed to send results");
        }

        return null;
    }

    render () {
        let ui = ''
        let roomData = this.props.location.state; 
        roomCode = roomData.roomCode;
        console.log(roomData);
        
        if (state === 0) {
            ui = (<div>
            <Nomination handleToUpdate = {this.handleToUpdate.bind(this)} />
            <h2 className="RoomCode">
                Room Code: {roomCode}
            </h2>
        </div>)
        } else if (state === 1){
            ui = (<div>
                <Card cardsList={cards} roomHeader={roomHeader} right={this.swipeRight.bind(this)} left={this.swipeLeft.bind(this)}/>
                <h2 className="RoomCode">
                    Room Code: {roomCode}
                </h2>
            </div>)//retrieve cards from backend or store locally
        } else if (state === 2) {
            ui = (<div>
                <h2>Waiting for others to finish voting...</h2>
            </div>)
        } else {
            let votingResults = this.getVotingResults();
            console.log(votingResults)
            ui = (
                <div>
                    <h2>Winner: {result}</h2>
                </div>
            )
        }
        return (
            <div className='PageFormat'>
                <div>
                    {ui}
                </div>
            </div>
        );
    }
}

export default SessionRoom;

class Nomination extends React.Component {
    constructor(props) {
      super(props);
      this.state = { options: [], ready: false}
      this.handleOptionSubmitted = this.handleOptionSubmitted.bind(this);
      this.done = this.done.bind(this)
    }
    handleOptionSubmitted () {
        if (this.newText.value === "")
            return
        this.state.options.push(this.newText.value)
        this.newText.value = ""
        this.forceUpdate()
    }
    done() {
        this.setState((state) => {
            return {options: this.state.options, ready: true}
          });
        cards = this.state.options
        console.log('list of cards:' + cards)
        for (let i = 0; i < cards.length; i++){  
            try {
                console.log("Attempting to send option");
                axios.post('http://localhost:3000/option', {roomCode: roomCode, option: cards[i]}, {headers: {'Content-Type': 'application/json'}}).then(res => {
                    console.log(res);
                    console.log("Successfully finished options post request")
                });
            } catch (err) {
                console.log(err);
                console.log("Failed to send option");
            }
        }

        setTimeout(this.props.handleToUpdate, 5000) //simulate a 5 second wait
        //this.props.handleToUpdate();
    }

    render() {
        let nominations = []
        for(let i = 0; i < this.state.options.length; i++){
            nominations.push(<div key={i}>{this.state.options[i]}</div>)
        }
        if (this.state.ready) {
            return(<div>
                <h3>
                    Waiting for others to finish nominating options
                </h3>
                <div className="CurrentNominations">
                    Your current nominations:
                        <div className= "Center">
                            <div className="ScrollBox">
                                {nominations}
                            </div>
                        </div>
                </div>
            </div>)
        } else {
            
            return (
                <div className="PageFormat">
                    <h2>Nominate Options</h2>
                    <form onSubmit={this.done}>
                        <label>
                            Add option:
                        </label>
                        <br></br>
                        <input className="InputOptionsField" type="text" maxLength="15" ref={(ip) => {this.newText = ip}}/>
                        <br></br>
            
                        <button className="SubmitButton" type="button" onClick={this.handleOptionSubmitted}>
                            Add
                        </button>
                        
                    </form>
                    <div className="CurrentNominations">
                        Your current nominations:
                        <div className= "Center">
                            <div className="ScrollBox">
                                {nominations}
                            </div>
                        </div>
                    </div>
                    <button className="SubmitButton" type="button" onClick={this.done}> 
                        Done
                    </button>
                </div>
            );
        }
    }
  }
