import React, { useState, useEffect } from 'react'
// import TinderCard from '../react-tinder-card/index'
import TinderCard from 'react-tinder-card'
import './Card.css';
import axios from "axios";


let db = [
]
//props = { cardsList: List, right:function, left:function}
function Card (props) {
  const characters = db
  const [lastDirection, setLastDirection] = useState()
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async() => {
    try {
      setLoading(true);
      console.log("Sending GET request to retrieve all room nominations")
      axios.get('http://localhost:3000/room', {
          headers: {'Content-Type': 'application/json'},
          withCredentials: true
      }).then(res => {
          let options = res.data.options;
          let tinder_cards = []
          for (let option of options) {
            tinder_cards.push(option.name);
          }
          setCards(tinder_cards);
          console.log(tinder_cards);
          setLoading(false);
      });
    } catch (err) {
        console.log(err);
        setLoading(false);
    }
  }, []);


  if(props.cardsList.length > 0) db = []

  for(let i = 0; i< cards.length; i++){
    //db.push({name:props.cardsList[i], url: ''})
    db.push({name:cards[i], url: ''})
  }

  const swiped = (direction, nameToDelete) => {
    //console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
    if(direction === "right") props.right()
    else props.left()
  }

  const outOfFrame = (name) => {
    //console.log(name + ' left the screen!')
  }

  if (loading) {
    return <span>Loading</span>
  }

  return (
    <div>
      <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
      <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
      <h3>{props.roomHeader}</h3>
      <div className='cardContainer'>
        {characters.map((character) =>
          <TinderCard className='swipe' key={character.name} preventSwipe={["up", "down"]} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
            <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        )}
      </div>
      {lastDirection ? <h6 className='infoText'>You swiped {lastDirection}</h6> : <h6 className='infoText' />}
    </div>
  )
}

export default Card;