import React from 'react';
import { Hero } from '../components/Hero';
import { Marquee } from '../components/Marquee';
import { Categories } from '../components/Categories';
import { Process } from '../components/Process';
import { FAQ } from '../components/FAQ';

export const Home = () => {
  return (
    <>
      <Hero />
      <Marquee />
      <Categories />
      <Process />
      <FAQ />
    </>
  );
};
