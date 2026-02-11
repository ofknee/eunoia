import { useEffect, useState } from 'react';

const getCountdown = () => { // calc total seconds //calc is slang for calculator if you're new to the chat
  const now = new Date();

  const secondsToday = // calc total seconds //calc is slang for calculator if you're new to the chat
    now.getHours() * 3600 + 
    now.getMinutes() * 60 +
    now.getSeconds();

  const secondsLeft = 86400 - secondsToday; // 86400 secs in a day

  const hours = Math.floor(secondsLeft / 3600); // floor gets rid of remainder minutes
  const minutes = Math.floor((secondsLeft % 3600) / 60); // floor gets rid of remainder seconds
  const seconds = secondsLeft % 60; // gets the remainder seconds

  return { hours, minutes, seconds };   // returning so its easy to use
};



// live countdown that updates every second (the part that gets used)
function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(getCountdown);   // initial value when first renders

  useEffect(() => {
    // update the countdown every 1 second.
    const timer = setInterval(() => {
      setTimeLeft(getCountdown
        ());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return {
    hours: timeLeft.hours,
    minutes: timeLeft.minutes,
    seconds: timeLeft.seconds,
  };
}

export default useCountdown; // make it useable in other file


/* ✪ HOW TO USE ✪

import useCountdown from '../lib/useCountdown'; (top of file, import code)
const { hours, minutes, seconds } = useCountdown(); (top of function, calling it)
{`next word in ${hours}:${minutes}:${seconds}`} (within the HTML, output it)

*/