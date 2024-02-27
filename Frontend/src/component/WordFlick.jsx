import React, { useState, useEffect } from 'react';
import './WordFlick.css'; // Import the CSS file for styling

const WordFlick = () => {
  const words = ['Engagement Analyzer'];
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < words[0].length) {
        setText((prevText) => prevText + words[0].charAt(index));
        setIndex((prevIndex) => prevIndex + 1);
      }
    }, 70); // Adjust the typing speed here

    return () => clearTimeout(timer);
  }, [index, words]);

  return (
    <div className="content flex justify-center items-center ">
      <h2 className="content_1 text-4xl md:text-6xl font-bold text-center animated-text">
        {text}
      </h2>
    </div>
  );
};

export default WordFlick;
