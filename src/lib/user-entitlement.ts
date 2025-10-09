/**
 * This file holds a bunch of functions that are used to understand the user's active plan.
 *
 * The implementation will differ based on your SaaS application logic. Here we have kept it very simple:
 *
 * 1. We have a table `UserFsEntitlement` that maps the user to their Freemius plan/license.
 * 2. The table is kept in sync with the Freemius API using webhooks.
 * 3. The user also has a `credits` field that tracks the user's credits.
 */
import { prisma } from '@/lib/prisma';
import { User } from '@generated/prisma';

// #region Freemius SDK Supporting Functions for User Entitlements & Webhooks

//#endregion

// #region Credit & Entitlement Management

export async function hasCredits(userId: string, credits: number = 1): Promise<boolean> {
    const creditsAvailable = await getCredits(userId);

    return creditsAvailable >= credits;
}

export async function getCredits(userId: string): Promise<number> {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return user.credit;
}

export async function deductCredits(userId: string, credits: number): Promise<User | null> {
    const updatedLicense = await prisma.user.update({
        where: { id: userId },
        data: { credit: { decrement: credits } },
    });

    return updatedLicense;
}

export async function addCredits(userId: string, credits: number): Promise<void> {
    await prisma.user.update({
        where: { id: userId },
        data: { credit: { increment: credits } },
    });
}

const resourceRecord = {
    // Subscription
    starter: 100,
    professional: 200,
    business: 500,

    // Top-ups
    topup_1000: 1000,
    topup_5000: 5000,
    topup_10000: 10000,
} as const;

// #endregion

// Private helpers

export async function getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
}
