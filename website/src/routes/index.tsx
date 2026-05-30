import { createFileRoute } from '@tanstack/react-router';
import { Hero } from '../sections/Hero';
import { ProblemSolution } from '../sections/ProblemSolution';
import { Features } from '../sections/Features';
import { HowItWorks } from '../sections/HowItWorks';
import { ApiHighlights } from '../sections/ApiHighlights';
import { CallToAction } from '../sections/CallToAction';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <Features />
      <HowItWorks />
      <ApiHighlights />
      <CallToAction />
    </>
  );
}
