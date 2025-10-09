import AppMain from '@/components/app-main';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { examples } from '@/lib/ai';
import AiApp from './ai-app';

export default async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <AppMain title="New Chat" isLoggedIn={!!session}>
            <AiApp examples={examples} />
        </AppMain>
    );
}
