import { useEffect, useState } from 'react';
import useCountdown from '../lib/useCountdown'; // code to get countdown in this src/lib/
import getWotd from '../utils/getWotd.js';

const dictKey = import.meta.env.VITE_DICT_KEY;



// ✧ get random word from textfile of words :P
// ☆ TODO make change daily rather than per reload ———> LATER NOT NOW (otherwise testing will be annoying)
// fyi the countdown rerenders Home() every second soooo keeping this code outside of Home()

// const wordful = WORDS.split('\n').filter(Boolean);
// const freakyNum = Math.floor(Math.random() * wordful.length);
// const magicWord = wordful[freakyNum] || ''; // ★ FIXME its getting rid of the spaces in phrases somewhere (ie quidproquo & fauxpas)


function Wotd() {
  const { hours, minutes, seconds } = useCountdown(); // from imported file

  const [magicWord, setMagicWord] = useState('');
  const [definition, setDefinition] = useState('');

  useEffect(() => {
    const loadWotd = async () => {
      try {
        const data = await getWotd();

        if (!data || !data.word) {
          setMagicWord('no word found');
          setDefinition('no definition found');
          return;
        }

        setMagicWord(data.word);
        setDefinition(data.definition || 'loading...'); //temporary
        return;
      
      } catch (error) {
        console.error('failed to load word of the day:', error);
        setMagicWord('error');
        setDefinition('failed to load definition');
        return;
      }
    };

    loadWotd();
  }, []);

  useEffect(() => {
    let cancelled = false;

    // if (!dictKey) {
    //   setDefinition('missing dictionary key');
    //   return;
    // }

    fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${magicWord}?key=${dictKey}`)
      .then(function (response) {
        if (!response.ok) {
          throw new Error(`dictionary request failed: ${response.status}`);      // ✧ error-prevention
        }
        return response.json();
      })
      .then(function (data) {
        if (cancelled) return;

        if (!Array.isArray(data) || data.length === 0 || typeof data[0] === 'string') {
          setDefinition('no definition found');
          return;
        }

        const definitions = data
          .filter(function (entry) {
            return entry && typeof entry === 'object' && Array.isArray(entry.shortdef);
          })
          .flatMap(function (entry) {
            return entry.shortdef;
          })
          .filter(Boolean)
          .slice(0, 4);

        setDefinition(definitions.length ? definitions.join('\n✦ ') : 'no definition found');
      })
      .catch(function (error) {
        if (cancelled) return;
        console.error('dictionary fetch failed:', error);
        setDefinition(function (prev) {
          return prev || 'failed to load definition';
        });
      });

    return function () {
      cancelled = true;
    };
  }, [magicWord]);


  // ✧ main page stuff
  return (
    <div className="home">
      <section className="intro">
        <h2>word of the day</h2>
        <p className="magic-word">
          {magicWord.split('').map((char, i) => (                           // animation for word on load (twin did u see the 67 hehe)
            <span key={i} className="magic-word-char" style={{ animationDelay: `${i * 0.167}s` }}> 
              {
                char // prints out each character indivually (humanism core)
              } 
            </span>
          ))}
        </p>
      </section> 
      <section className="definition">
        <h2>definition ✰</h2>
        <p>✦ {definition}</p> 
        
      </section>
      <p className="wotd-countdown">{`next word in ${hours} hours, ${minutes} minutes, and ${seconds} seconds`} </p> {/* ☆ TODO prettify countdown */}
      
    </div>
  );
}

export default Wotd;
