import AppMain, { AppContent } from '@/components/app-main';
import { auth } from '@/lib/auth';
import { getCredits } from '@/lib/user-entitlement';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ErrorBoundary } from '@/components/error';
import Credits from './credits';
import { freemius } from '@/lib/freemius';
import AppCheckoutProvider from '@/components/app-checkout-provider';

export default async function CreditsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/login');
    }

    const credits = await getCredits(session.user.id);

    const checkout = await freemius.checkout.create({
        user: session?.user,
        isSandbox: process.env.NODE_ENV !== 'production',
    });

    return (
        <AppMain title="Credits & Topups" isLoggedIn={true}>
            <AppContent>
                <ErrorBoundary>
                    <AppCheckoutProvider checkout={checkout.serialize()}>
                        <Credits credits={credits} />
                    </AppCheckoutProvider>
                </ErrorBoundary>
            </AppContent>
        </AppMain>
    );
}
