import React from 'react';
import ReactDOM from 'react-dom';

function JoinRoom() {
    return (
        <div>
            <h2>Join Room</h2>
            <form>
                <label>
                    Room Code:
                    <input type="text"/>
                </label>
            </form>
        </div>
    );
}

export default JoinRoom;