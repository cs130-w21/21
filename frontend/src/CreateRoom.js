import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Link, Route, useHistory} from "react-router-dom";

function CreateRoomButton() {
    let history = useHistory();
 
    function handleClick() {
        if (optionClicked !== 0) {
            console.log(optionClicked) //This is where we would want to POST request
            history.push("/room") 
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
let optionClicked = 0;

function CreateRoom() {
    let onSelectChange = (cb) => { optionClicked = cb.currentTarget.value}
    return (
        <div className='PageFormat'>
            <h2>Choose Room Settings</h2>
            <select className="DropdownMenu" onChange={onSelectChange}>
                <optgroup >
                    <option value ="0">Select an Option</option> 
                    <option value="1">UCLA Study Locations</option>
                    <option value="2">UCLA Food Options</option>
                    <option value="3">Custom</option>
                </optgroup>
            </select>
            <CreateRoomButton />
        </div>
    );
}

export default CreateRoom;