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
    <span className="text-[#577C8E] font-bold relative">
      {displayedText}
      <span className="blinking-cursor right-[-0.3rem]">|</span>

      <style jsx>{`
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
