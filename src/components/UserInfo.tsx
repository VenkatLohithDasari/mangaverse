// components/UserInfo.tsx
'use client';

import { useSession } from 'next-auth/react';

export default function UserInfo() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'unauthenticated') {
        return <div>Not signed in</div>;
    }

    return (
        <div>
            <p>Signed in as {session?.user?.username || session?.user?.name}</p>
            <p>Role: {session?.user?.role}</p>
            <p>Discord ID: {session?.user?.discordId}</p>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    );
}
