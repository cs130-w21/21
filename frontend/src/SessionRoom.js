import React from 'react';
import ReactDOM from 'react-dom';


let customRoom = true
let roomCode = "12345"

class SessionRoom extends React.Component {

    handleToUpdate() { //This is called by child nomination component
        console.log("worked")
        customRoom = false
        this.forceUpdate();
    }
    render () {
        let ui = '';
        let roomData = this.props.location.state; 
        roomCode = roomData.roomCode;
        console.log(roomData);

        if (customRoom) {
            ui = (
            <Nomination handleToUpdate = {this.handleToUpdate.bind(this)} />)
        } else {
            ui = (<div>
                    Placeholder until we get the cards set up
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
        console.log(this.state.options)
        this.newText.value = ""
        this.forceUpdate()
    }
    done() {
        this.setState((state) => {
            return {options: this.state.options, ready: true}
          });
        console.log("happened " + this.state.ready)
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