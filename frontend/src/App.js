import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Link, Route, useHistory} from "react-router-dom";
import CreateRoom from './CreateRoom.js'
import JoinRoom from './JoinRoom.js'

const buttomFormat = "cursor-pointer transition-colors bg-yellow-300 hover:bg-yellow-500 rounded-md text-black font-bold m-2 p-2 text-2xl w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6"
function CreateButton() {
  let history = useHistory();

  function handleClick() {
    history.push("/create");
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
