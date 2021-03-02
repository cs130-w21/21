import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';
import axios from 'axios';

function SubmitButton() {

    function handleClick() {
        console.log("code: ");
    }
    return (
      <div style={{paddingTop: 20, paddingBottom:20 }}>
        <button className="MenuButton" type="button" >
          Join
        </button>
      </div>
    )
}

let handleSubmit = async(event) => {
    event.preventDefault()
    let roomCode = String(event.target[0].value)
    console.log("Code entered: " + roomCode);

    try {
        console.log("Attempting post request to join room")
        axios.post("http://localhost:3000/room/join", {user: "Member", roomCode: roomCode}).then(res => {
            console.log(res)
            console.log("Successfully joined room")
        })
    } catch (err) {
        console.log(err)
        console.log("Failed to join room")
    }
}


function JoinRoom() {
    
    return (
        <div className='PageFormat'>
            <h2>Join Room</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Room Code:
                </label>
                <br></br>
                <input className="InputField" type="text" maxLength="25"/>
                <br></br>
                <button className="SubmitButton" type="submit"> Submit</button>
            </form>
        </div>
    );
}

export default JoinRoom;