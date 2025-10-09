import AppMain from '@/components/app-main';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { freemius } from '@/lib/freemius';
import { examples } from '@/lib/ai';
import AppCheckoutProvider from '@/components/app-checkout-provider';
import AiApp from './ai-app';

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
            <AppCheckoutProvider checkout={checkout.serialize()}>
                <AiApp examples={examples} />
            </AppCheckoutProvider>
        </AppMain>
    );
}
