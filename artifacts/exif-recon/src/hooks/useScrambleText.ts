import { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$';

export function useScrambleText(text: string, durationMs: number = 1200) {
  const [displayText, setDisplayText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const iterationRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    iterationRef.current = 0;
    setIsDone(false);
    
    // Convert duration to approx number of frames assuming 60fps (~16ms per frame)
    // We want the whole text to resolve by the end.
    const totalFrames = durationMs / 16;
    const framesPerLetter = totalFrames / text.length;

    const tick = () => {
      iterationRef.current += 1;
      
      const currentIteration = iterationRef.current;
      const lettersResolved = Math.floor(currentIteration / framesPerLetter);
      
      if (lettersResolved >= text.length) {
        setDisplayText(text);
        setIsDone(true);
        return;
      }

      const scrambled = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < lettersResolved) {
            return text[index];
          }
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      setDisplayText(scrambled);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameRef.current);
  }, [text, durationMs]);

  return { displayText, isDone };
}
