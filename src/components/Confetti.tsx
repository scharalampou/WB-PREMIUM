
"use client";

import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

type ConfettiBurstProps = {
  recycle?: boolean;
  numberOfPieces?: number;
};

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({
  recycle = false,
  numberOfPieces = 200, // Reduced for a quicker burst
}) => {
  const { width, height } = useWindowSize();
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRunning(false);
    }, 4000); // Stop confetti after 4 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!width || !height) {
    return null;
  }

  return (
    <Confetti
      width={width}
      height={height}
      recycle={isRunning}
      numberOfPieces={numberOfPieces}
      style={{ pointerEvents: 'none' }}
      gravity={0.1}
      run={isRunning}
    />
  );
};
