'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingAnimation from "../components/LoadingAnimation";
import LandingPage from "../components/LandingPage";

export default function HomePage() {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(false);


  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('formData');
    const role = localStorage.getItem('userRole');

    if (userData && role) {
      // User is logged in, redirect based on role
      if (role === 'specialist') {
        router.replace('/homespecialist');
      } else {
        router.replace('/homeclient'); // Clients go to their home page when logged in
      }
    } else {
      // Always show Fixoo text animation when entering the platform
      setShowLoading(true);
    }
  }, [router]);

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
