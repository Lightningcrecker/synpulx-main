import React from 'react';
import { Hero } from '../components/landing/Hero';
import { Navbar } from '../components/shared/Navbar';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
    </div>
  );
};