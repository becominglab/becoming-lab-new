'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UnitsRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/mm/subjects'); }, [router]);
  return null;
}
