import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import TinderCard from 'react-tinder-card';
import Card from './Card';

let customRoom = true
let roomCode = "12345"
let cards = []
let cardResults = []
let currentIndex = 0;
//TODO have server generate a room code instead

class SessionRoom extends React.Component {
    handleToUpdate() { //This is called by child nomination component
        customRoom = false
        //GET request here to get list of all cards
        for(let i=0; i < cards.length; i++){
            cardResults.push({name: cards[i], result: false})
        }
        this.forceUpdate();
    }
    swipeRight(){
        console.log("swiped right")
        cardResults[currentIndex].result = true
        currentIndex++
        if(currentIndex >= cardResults.length){
            this.doneVoting()
        }
    }
    swipeLeft(){
        console.log("swiped left")
        cardResults[currentIndex].result = false
        currentIndex++
        if(currentIndex >= cardResults.length){
            this.doneVoting()
        }
    }
    doneVoting(){
        console.log("done voting" + cardResults)
        //adding code here to retrieve results and display winner
    }
    render () {
        let ui = ''
        if (customRoom) {
            ui = (
            <Nomination handleToUpdate = {this.handleToUpdate.bind(this)} />)
        } else {
            ui = (<div>
                <Card cardsList={cards} right={this.swipeRight.bind(this)} left={this.swipeLeft.bind(this)}/>
            </div>)//retrieve cards from backend or store locally
        }
        return (
            <div className='PageFormat'>
                <div>
                    {ui}
                </div>
                <h2 className="RoomCode">
                    Room Code: {roomCode}
                </h2>
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
                        <input className="InputOptionsField" type="text" ref={(ip) => {this.newText = ip}}/>
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
