import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Hero from './sections/home/Hero';
import ModulesGrid from './sections/home/ModulesGrid';
import Checklist from './sections/home/Checklist';

export default function Home() {
  const { openAuth } = useOutletContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero onOpenAuth={openAuth} />
      <ModulesGrid onOpenModule={openAuth} />
      <Checklist />
    </>
  );
}