import { auth } from '@/lib/auth';
import { freemius } from '@/lib/freemius';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { CustomerPortal } from '@/react-starter/components/customer-portal';
import FSCheckoutProvider from '@/components/fs-checkout';
import AppMain, { AppContent } from '@/components/app-main';

export default async function Billing() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/login');
    }

    const checkout = await freemius.checkout.create({
        user: session?.user,
        isSandbox: process.env.NODE_ENV !== 'production',
    });

    return (
        <AppMain title="Billing" isLoggedIn={true}>
            <AppContent>
                <FSCheckoutProvider checkout={checkout.serialize()}>
                    <CustomerPortal endpoint={process.env.NEXT_PUBLIC_APP_URL! + '/api/portal'} />
                </FSCheckoutProvider>
            </AppContent>
        </AppMain>
    );
}
