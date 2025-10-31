"use client";

import { useState, useEffect } from 'react';

export const useWallet = () => {
  const [totalEarnings, setTotalEarnings] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEarnings = parseFloat(localStorage.getItem('clipverse_total_earnings') || '0');
      setTotalEarnings(storedEarnings);
    }
  }, []);

  const updateEarnings = (amount: number) => {
    if (typeof window !== "undefined") {
      const newEarnings = totalEarnings + amount;
      localStorage.setItem('clipverse_total_earnings', newEarnings.toFixed(2));
      setTotalEarnings(newEarnings);
    }
  };

  return { totalEarnings, updateEarnings };
};