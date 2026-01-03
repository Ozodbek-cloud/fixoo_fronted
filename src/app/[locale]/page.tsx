'use client';
// Triggering rebuild to fix stale Footer.jsx reference

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingAnimation from "../components/LoadingAnimation";
import LandingPage from "../components/LandingPage";

export default function HomePage() {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(false);


  useEffect(() => {
    // Always show Fixoo text animation when entering the platform
    setShowLoading(true);
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setShowLanding(true);
  };

  if (showLoading) {
    return <LoadingAnimation onComplete={handleLoadingComplete} />;
  }

  if (showLanding) {
    return <LandingPage />;
  }

  return null;
}
