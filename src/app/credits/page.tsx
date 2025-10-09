import AppMain, { AppContent } from '@/components/app-main';
import { auth } from '@/lib/auth';
import { getCredits } from '@/lib/user-entitlement';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ErrorBoundary } from '@/components/error';
import Credits from './credits';

export default async function CreditsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect('/login');
    }

    const credits = await getCredits(session.user.id);

    return (
        <AppMain title="Credits & Topups" isLoggedIn={true}>
            <AppContent>
                <ErrorBoundary>
                    <Credits credits={credits} />
                </ErrorBoundary>
            </AppContent>
        </AppMain>
    );
}
