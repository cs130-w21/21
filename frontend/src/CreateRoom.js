import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import axios from "axios";
import './App.css';

function CreateRoom(props) {

    var roomData = props.location.state;

    console.log(roomData);
    console.log(roomData.roomCode);


    /* <div className='room-members'>
                {roomData.members.map((member, index) => (
                    <React.Fragment key={index}>
                        <p>Member</p>
                    </React.Fragment>
                ))}
            </div> */

    return (
        <div className='PageFormat'>
            <h3> Invite Your Friends!</h3>
            <label>Room Code</label>
            <p style={{color: "Grey"}}>{roomData.roomCode}</p>
        </div>
    );
}

export default CreateRoom;