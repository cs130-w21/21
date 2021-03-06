import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import './App.css';
import {BrowserRouter as Router, Link, Route, useHistory} from "react-router-dom";

function CreateRoomButton() {
    let history = useHistory();
 
    function handleClick() {
        console.log(optionClicked) //This is where we would want to POST request
        if (optionClicked == 3) {

            try {
                console.log("Attempting to make post request");
                axios.post('http://localhost:3000/room', {user: "Owner"}, {headers: {'Content-Type': 'application/json'}}).then(res => {
                    console.log(res);
                    console.log("Successfully finished post request")
                    history.push("/room", res.data);
                });
            } catch (err) {
                console.log(err);
                console.log("Failed to create room");
            }
        } else if (optionClicked == 1){
            try {
                console.log("Attempting to make post request");
                axios.post('http://localhost:3000/room/study', {user: "Owner"}, {headers: {'Content-Type': 'application/json'}}).then(res => {
                    console.log(res);
                    console.log("Successfully finished post request")
                    history.push("/room", res.data);
                });
            } catch (err) {
                console.log(err);
                console.log("Failed to create room");
            }
        }else if (optionClicked == 2){
            try {
                console.log("Attempting to make post request");
                axios.post('http://localhost:3000/room/food', {user: "Owner"}, {headers: {'Content-Type': 'application/json'}}).then(res => {
                    console.log(res);
                    console.log("Successfully finished post request")
                    history.push("/room", res.data);
                });
            } catch (err) {
                console.log(err);
                console.log("Failed to create room");
            }
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

function CreateRoom(props) {

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