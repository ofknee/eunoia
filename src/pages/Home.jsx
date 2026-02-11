import WORDS from '../words.txt?raw';

function Home() {
  // ✧ get random word from textfile of words :P
  // ☆ make change daily rather than per reload ———> LATER NOT NOW (otherwise testing will be annoying)
  const wordful = WORDS.split('\n').filter(Boolean);
  const freakyNum = Math.floor(Math.random() * wordful.length);
  const magicWord = wordful[freakyNum] || ''; // ☆ FIXME its getting rid of the spaces in phrases somewhere 

  return (
    <div className="home">
      <section className="intro">
        <h1>word of the day</h1>
        <p className="magic-word" aria-label={magicWord}>
          {magicWord.split('').map((char, i) => (
            <span key={i} className="magic-word-char" style={{ animationDelay: `${i * 0.0267}s` }}>
              {char}
            </span>
          ))}
        </p>
      </section>
    </div>
  );
}

export default Home;



