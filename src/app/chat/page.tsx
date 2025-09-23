import AppMain from '@/components/app-main';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { examples } from '@/lib/ai';
import AiApp from './ai-app';
import { freemius } from '@/lib/freemius';
import FSCheckoutProvider from '@/components/fs-checkout';

export default async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const checkout = await freemius.checkout.create({
        user: session?.user,
        isSandbox: process.env.NODE_ENV !== 'production',
    });

    return (
        <AppMain title="New Chat" isLoggedIn={!!session}>
            <FSCheckoutProvider checkout={checkout.serialize()}>
                <AiApp examples={examples} />
            </FSCheckoutProvider>
        </AppMain>
    );
}
