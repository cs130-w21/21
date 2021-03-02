import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Link, Route, useHistory} from "react-router-dom";
import CreateRoom from './CreateRoom.js'
import JoinRoom from './JoinRoom.js'
import axios from "axios";


function CreateButton() {
  let history = useHistory();
  const [roomCode, setRoomCode] = useState([]);

  /*
  function handleClick() {
    history.push("/create");
  } */

  const handleClick = async() => {
    try {
      console.log("Attempting to make post request");
      axios.post('http://localhost:3000/room', {user: "Owner"}, {headers: {'Content-Type': 'application/json'}}).then(res => {
          console.log(res);
          console.log("Successfully finished post request")
          history.push("/create", res.data);
      });
    } catch (err) {
        console.log(err);
        console.log("Failed to create room");
    }
  }

  return (
    <div style={{paddingTop: 20, paddingBottom:20 }}>
      <button className="MenuButton" type="button" onClick={handleClick}>
        Create Room
      </button>
    </div>
  )
}

function JoinButton() {
  let history = useHistory();

  function handleClick() {
    history.push("/join");
  }

  return (
    <div style={{paddingTop: 20, paddingBottom:20 }}>
      <button className="MenuButton" type="button" color="primary" onClick={handleClick}>
        Join Room
      </button>
    </div>
  )
}

const t = {
  paddingTop: 20,
  paddiingRight: 20,
  paddingLeft: 20,
  paddingBottom: 20
}
//{{height: '50%', width: '300px', margin: 'auto'}}>
function Home() {
  return (
    <div className='PageFormat' style={t}> 
      <h1>PICKR</h1>
      <div>
        <CreateButton/>
      </div>
      <div>
        <JoinButton/>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home}/>
        <Route exact path="/create" component={CreateRoom}/>
        <Route exact path="/join" component={JoinRoom}/>
      </div>
    </Router>
  )
}


export default App;
