import React, { useState } from 'react'
// import TinderCard from '../react-tinder-card/index'
import TinderCard from 'react-tinder-card'
import './Card.css';

let db = [
  {
    name: 'De Neve',
    url: ''
  },
  {
    name: 'Bruin Plate',
    url: ''
  },
  {
    name: 'FEAST',
    url: ''
  }
]
//props = { cardsList: List, right:function, left:function}
function Card (props) {
  const characters = db
  const [lastDirection, setLastDirection] = useState()
  if(props.cardsList.length > 0) db = []

  for(let i = 0; i< props.cardsList.length; i++){
    db.push({name:props.cardsList[i], url: ''})
  }

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
    if(direction === "right") props.right()
    else props.left()
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  return (
    <div>
      <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
      <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
      <h3>Where should we eat?</h3>
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