"use client";
import React, { useEffect, useState } from "react";

const words = ["DREAM", "PERFECT", "IDEAL", "NEXT", "FUTURE"];

const TypingWords = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullWord = words[currentWordIndex];
    const typingSpeed = isDeleting ? 50 : 120;

    const timer = setTimeout(() => {
      if (isDeleting) {
        setDisplayedText((prev) => prev.slice(0, -1));
      } else {
        setDisplayedText((prev) => fullWord.slice(0, prev.length + 1));
      }

      if (!isDeleting && displayedText === fullWord) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentWordIndex]);

  return (
    <span className="gradient-text font-bold relative">
      {displayedText}
      <span className="blinking-cursor right-[-0.3rem]">|</span>

      <style jsx>{`
        .gradient-text {
          background: linear-gradient(to right, #577C8E, #3A5566);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent; 
        }

        .blinking-cursor {
          animation: blink 0.6s steps(2, start) infinite;
        }

        @keyframes blink {
          to {
            visibility: hidden;
          }
        }
      `}</style>
    </span>
  );
};

export default TypingWords;
