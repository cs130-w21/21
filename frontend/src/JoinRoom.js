import React from 'react';
import './App.css';
import ReactDOM from 'react-dom';

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

let handleSubmit = (event) => {
    event.preventDefault()
    let roomCode = event.target[0].value
    console.log("Code entered: " + roomCode)
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
                <input class="InputField" type="text" maxLength="5"/>
                <br></br>
                <button className="SubmitButton" type="submit"> Submit</button>
            </form>
        </div>
    );
}

export default JoinRoom;