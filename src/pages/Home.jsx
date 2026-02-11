import useCountdown from '../lib/useCountdown'; // code to get countdown in this src/lib/
import WORDS from '../words.txt?raw';

  // ✧ get random word from textfile of words :P
  // ☆ TODO make change daily rather than per reload ———> LATER NOT NOW (otherwise testing will be annoying)
  // fyi the countdown rerenders Home() every second soooo keeping this code outside of Home()
const wordful = WORDS.split('\n').filter(Boolean);
const freakyNum = Math.floor(Math.random() * wordful.length);
const magicWord = wordful[freakyNum] || ''; // ★ FIXME its getting rid of the spaces in phrases somewhere 


function Home() {
  const { hours, minutes, seconds } = useCountdown(); // from imported file
 
  // ✧ main page stuff
  return (
    <div className="home">
      <section className="intro">
        <h1>word of the day</h1>
        <p className="magic-word" aria-label={magicWord}>
          {magicWord.split('').map((char, i) => (                           // animation for word on load (twin did u see the 67 hehe)
            <span key={i} className="magic-word-char" style={{ animationDelay: `${i * 0.0267}s` }}> 
              {
                char // prints out each character indivually
              } 
            </span>
          ))}
        </p>
      </section>  {/* ☆ TODO add api */}
      <p>{`next word in ${hours}:${minutes}:${seconds}`}</p> {/* ☆ TODO prettify countdown */}
    </div>
  );
}

export default Home;

