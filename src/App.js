import { useEffect, useRef, useState } from 'react';
import './game.css';
const cardDeck = [
  {
    name: 'squatch1',
    img: './images/squatch1.png',
  },
  {
    name: 'squatch2',
    img: './images/squatch2.png',
  },
  {
    name: 'squatch3',
    img: './images/squatch3.png',
  },
  {
    name: 'squatch4',
    img: './images/squatch4.png',
  },
  {
    name: 'squatch5',
    img: './images/squatch5.png',
  },
  {
    name: 'squatch6',
    img: './images/squatch6.png',
  },
  {
    name: 'squatch7',
    img: './images/squatch7.png',
  },
  {
    name: 'squatch8',
    img: './images/squatch8.png',
  },
  {
    name: 'squatch9',
    img: './images/squatch9.png',
  },
  {
    name: 'squatch10',
    img: './images/squatch10.png',
  },
  {
    name: 'squatch11',
    img: './images/squatch11.png',
  },
];

const cardbacksrc = './images/cardback.jpg';
const matchedsrc = './images/matched.png';

let cardArrayCopy = cardDeck.map((x) => x);
let fullArray = cardDeck.concat(cardArrayCopy);
fullArray.sort(() => 0.5 - Math.random());
const dealSpeed = 300;

function disableClicking() {
  let cards = document.querySelectorAll('.gameboard img');
  for (const card of cards) {
    card.setAttribute('style', 'pointer-events: none');
  }
}
function enableClicking() {
  let cards = document.querySelectorAll('.gameboard img');
  for (const card of cards) {
    let match = card.getAttribute('data-match');
    if (!match) {
      card.setAttribute('style', 'pointer-events: auto');
    }
  }
}
const setMatchedAttributes = (card) => {
  card.setAttribute('data-match', true);
  card.setAttribute('src', matchedsrc);
  card.setAttribute('style', 'pointer-events: none');
};
function Match() {
  const main = useRef();
  let chosen = [];
  let matched = [];
  const maxLives = 10;
  const [hearts, setHearts] = useState(maxLives);
  const [screen, setScreen] = useState('');

  const clearBoard = () => {
    const board = main.current;
    board.innerHTML = '';
  };

  const init = () => {
    clearBoard();
    setScreen('');
    const dealCards = (arr, i) => {
      if (i === arr.length) {
        console.log('all cards dealt');
        enableClicking();
      } else {
        const card = document.createElement('img');
        card.setAttribute('src', cardbacksrc);
        card.setAttribute('data-id', i);
        card.addEventListener('click', flipCard.bind(this));
        card.setAttribute('style', 'pointer-events:none');
        main.current.appendChild(card);
        setTimeout(dealCards, dealSpeed, arr, i + 1);
      }
    };
    dealCards(fullArray, 0);
  };

  const flipCard = (e) => {
    let self = e.target;
    console.log(self);
    self.setAttribute('src', fullArray[self.getAttribute('data-id')].img);
    chosen.push(self);
    if (chosen.length === 2) {
      disableClicking();
      setTimeout(checkforMatch.bind(this), 1500);
    }
  };

  const checkforMatch = () => {
    let card1 = chosen[0];
    let card2 = chosen[1];
    let cardName1 = fullArray[card1.getAttribute('data-id')].name;
    let cardName2 = fullArray[card2.getAttribute('data-id')].name;

    if (cardName1 === cardName2) {
      matched.push(card1, card2);
      setMatchedAttributes(card1);
      setMatchedAttributes(card2);
      setHearts((z) => (z === maxLives ? z : z + 1));

      if (matched.length === fullArray.length) {
        console.log('winner');
        youWin();
      }
    } else {
      setHearts((z) => z - 1);
      card1.setAttribute('src', cardbacksrc);
      card2.setAttribute('src', cardbacksrc);
    }

    chosen = [];
    enableClicking();
  };
  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    switch (hearts) {
      case 0:
        gameOver();
        break;
      default:
        break;
    }
  }, [hearts]);

  const gameOver = async () => {
    clearBoard();
    setHearts(maxLives);
    setScreen(loseScreen);
  };
  const youWin = async () => {
    clearBoard();
    setHearts(maxLives);
    setScreen(winScreen);
  };
  const loseScreen = () => {
    return (
      <>
        {' '}
        <h1>GAME OVER</h1>
        <div className='new-game-container'>
          <button onClick={init}>New Game</button>
        </div>
      </>
    );
  };
  const winScreen = () => {
    return (
      <>
        <h1>You Win!</h1>{' '}
        <div className='new-game-container'>
          <button onClick={init}>New Game</button>
        </div>
      </>
    );
  };
  return (
    <div className='matchgame'>
      <div className='scoreBoard'>
        <h1>Matchsquatch</h1>
        <span>♥ {hearts}</span>
      </div>
      <div className='gameboard' ref={main}></div>
      <div className='screenContainer'>{screen}</div>
    </div>
  );
}

export default Match;
