'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
const { user } = useAuth() as { user: any };
const router = useRouter();

useEffect(() => {
    if (!user) {
        router.push('/login');
    }
}, [router, user]);

if (!user) {
    return <div>Loading...</div>;
}

  return <>{children}</>;
}
