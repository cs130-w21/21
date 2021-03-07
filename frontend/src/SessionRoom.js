import React from 'react';
import ReactDOM from 'react-dom';
import TinderCard from 'react-tinder-card';
import Card from './Card';
import axios from "axios";
import {useHistory} from 'react-router-dom';
import ReactPolling from 'react-polling';


let roomCode = "12345"
let cards = []
let tinder_cards = []
let cardResults = []
let currentIndex = 0
let roomHeader = "Do you like this option?"


class SessionRoom extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            roomState: 0, //0 = nomination, 1 = swipe, 2 = waiting to finish swiping, 3 = winner
            results: [],
            vote_poll: true
        };
        cards = [];
        cardResults = [];
        currentIndex = 0;
        let roomData = props.location.state;
        //console.log(roomData)
        if (roomData.options) { //there are options
            for (let i = 0; i < roomData.options.length; i++){
                cards.push(roomData.options[i])
            }
            this.state = {
                roomState: 1, //0 = nomination, 1 = swipe, 2 = waiting to finish swiping, 3 = winner
                results: [],
                poll: true
            };
            this.handleToUpdate()
        }
        this.handleMainMenu = this.handleMainMenu.bind(this);
    }

    componentDidMount() {
        this.timer = setInterval(()=> this.roomFinishedVoting(), 3000);
    }

    handleToUpdate() { //This is called by child nomination component
        this.setState({roomState: 1});
        currentIndex = 0
        axios.get('http://localhost:3000/room', {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
      }).then(res => {
          let options = res.data.options;
          for (let option of options) {
            tinder_cards.push(option.name);
          }
          for(let i=tinder_cards.length-1; i > -1; i--){
            cardResults.push({name: tinder_cards[i], result: false})
        }
      });
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
        console.log("done voting")
        this.setState({roomState: 2});
        //adding code here to retrieve results and display winner
        let dict = {}
        for(let i = 0; i<cardResults.length; i++){
            dict[cardResults[i].name] = cardResults[i].result
        }
        console.log(dict)
        try { //get options here if its not a cutsom room
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

        this.forceUpdate()
    }

    roomFinishedVoting() {
        if(this.state.vote_poll)
        {
            console.log("Polling to see if voting finished")
            axios.get('http://localhost:3000/roomDoneVoting', {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }).then(res => {
                if(res.data.done)
                {
                    this.state.vote_poll = false;
                    this.getVotingResults();
                }
            });
        }
    }

    getVotingResults()
    {
        axios.get("http://localhost:3000/room", {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
        }).then(res => {
            let votingResults = res["data"]["options"];
            let sortedVotingResults = votingResults.sort((a, b) => b.yes - a.yes);
            this.setState({ 
                results: sortedVotingResults, 
                roomState: 3
            });
        });
    }

    handleMainMenu()
    {
        console.log(roomCode)
        axios.delete(
            "http://localhost:3000/room",
            {
                data: { roomCode: roomCode },
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }
        ).then(() => {
            console.log("room deleted")
        });

        this.props.history.push('/');
    }

    render () {
        let ui = ''
        let roomData = this.props.location.state; 
        roomCode = roomData ? roomData.roomCode: "12345";

        console.log("state " + this.state.roomState + "\ncards " + tinder_cards);

        if (this.state.roomState === 0) {
            ui = (<div>
            <Nomination handleToUpdate = {this.handleToUpdate.bind(this)} />
            <h2 className="RoomCode">
                Room Code: {roomCode}
            </h2>
        </div>)
        } else if (this.state.roomState === 1){

            ui = (<div>
                <Card cardsList={tinder_cards} roomHeader={roomHeader} right={this.swipeRight.bind(this)} left={this.swipeLeft.bind(this)}/>
                <h2 className="RoomCode">
                    Room Code: {roomCode}
                </h2>
            </div>)//retrieve cards from backend or store locally
        } else if (this.state.roomState === 2) { // Waiting state

            ui = (<div>
                <h2>Waiting for others to finish voting...</h2>
            </div>) 

        } else {
            console.log("results" + this.state.results)
            ui = (
                <div>
                    <h2>Winner: {this.state.results[0] ? this.state.results[0].name : ""}</h2>
                    <table>
                        <tbody>
                        <tr>
                            <th>Option</th>
                            <th>Votes</th>
                        </tr>
                        {this.state.results.map((option, index) => {
                            return (
                                <tr key={index}>
                                    <td>{option.name}</td>
                                    <td>{option.yes}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                    <button 
                        className="MenuButton" 
                        type="button"
                        style={{marginTop: 50 + "px"}}
                        onClick={this.handleMainMenu}>
                        Main Menu
                    </button>
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
      this.state = { options: [], ready: false, nomination_poll: true}
      this.handleOptionSubmitted = this.handleOptionSubmitted.bind(this);
      this.done = this.done.bind(this)
    }
    
    componentDidMount() {
        this.timer = setInterval(()=> this.roomFinishedNominating(), 5000);
    }


    roomFinishedNominating() {
        if (this.state.nomination_poll)
        {
            const isDoneNominating = (member) => member.doneNominating == true;
            console.log("Polling to see if nomination is finished")
            axios.get('http://localhost:3000/room', {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }).then(res => {

                let roomData = res.data;
                console.log(res);
                console.log(roomData);

                let members = roomData.members;
                let membersDoneNominating = members.every(isDoneNominating);
                let ownerDoneNominating = roomData.owner.doneNominating;

                if (ownerDoneNominating && membersDoneNominating) {
                    this.state.nomination_poll = false;
                    console.log("Everyone is finished with their nominations")
                    this.props.handleToUpdate();
                }
            });
        }
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

        // Make another post request to set done nominating field to true
        try {
            console.log("Attempting to POST to set doneNominating to true")
            axios.post('http://localhost:3000/option/nomination', {roomCode: roomCode},{
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            }).then(res => {
                console.log(res);
                console.log("Successfully set doneNominating to true")
            });
        } catch (err) {
            console.log(err)
            console.log("Failed to set doneNominating to true");
        }
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
