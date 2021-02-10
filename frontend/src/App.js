import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Link, Route, useHistory} from "react-router-dom";
import CreateRoom from './CreateRoom.js'
import JoinRoom from './JoinRoom.js'


function CreateButton() {
  let history = useHistory();

  function handleClick() {
    history.push("/create");
  }

  return (
    <button type="button" onClick={handleClick}>
      Create Room
    </button>
  )
}

function JoinButton() {
  let history = useHistory();

  function handleClick() {
    history.push("/join");
  }

  return (
    <button type="button" color="primary" onClick={handleClick}>
      Join Room
    </button>
  )
}


function Home() {
  return (
    <div>
      <h2>PICKR</h2>
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
