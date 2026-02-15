import { useEffect, useState } from 'react';
import useCountdown from '../lib/useCountdown'; // code to get countdown in this src/lib/
import WORDS from '../words.txt?raw';

// ✧ get random word from textfile of words :P
// ☆ TODO make change daily rather than per reload ———> LATER NOT NOW (otherwise testing will be annoying)
// fyi the countdown rerenders Home() every second soooo keeping this code outside of Home()
const wordful = WORDS.split('\n').filter(Boolean);
const freakyNum = Math.floor(Math.random() * wordful.length);
const magicWord = wordful[freakyNum] || ''; // ★ FIXME its getting rid of the spaces in phrases somewhere (ie quidproquo & fauxpas)

function Wotd() {
  const { hours, minutes, seconds } = useCountdown(); // from imported file
  
  const [definition, setDefinition] = useState(''); 

  useEffect(() => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${magicWord}`)
      .then((r) => r.json()) 
      .then((d) => setDefinition(d?.[0]?.meanings?.[0]?.definitions?.[0]?.definition || 'no definition found'))
      .catch(() => setDefinition('failed to load definition')); 
  }, [magicWord]); 

  // ✧ main page stuff
  return (
    <div className="home">
      <section className="intro">
        <h1>word of the day</h1>
        <p className="magic-word">
          {magicWord.split('').map((char, i) => (                           // animation for word on load (twin did u see the 67 hehe)
            <span key={i} className="magic-word-char" style={{ animationDelay: `${i * 0.0267}s` }}> 
              {
                char // prints out each character indivually (humanism core)
              } 
            </span>
          ))}
        </p>
      </section> 
      <section className="definition">
        <h2>definition</h2>
        <p>{definition}</p> 
      </section>
      <p>{`next word in ${hours} hours, ${minutes} minutes, and ${seconds} seconds`}</p> {/* ☆ TODO prettify countdown */}
    </div>
  );
}

export default Wotd;
