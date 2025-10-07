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
import { PurchaseInfo, UserRetriever } from '@freemius/sdk';
import { User, UserFsEntitlement } from '@generated/prisma';
import { auth } from './auth';
import { headers } from 'next/headers';
import { freemius } from './freemius';

// #region Freemius SDK Supporting Functions for User Entitlements

export async function processPurchaseInfo(fsPurchase: PurchaseInfo): Promise<void> {
    // Todo: fill me
}

export async function getUserEntitlement(userId: string): Promise<UserFsEntitlement | null> {
    // Todo: fill me
}

export const getFsUser: UserRetriever = async () => {
    // Todo: fill me
};

function getEntitledCredits(fsPurchase: PurchaseInfo): number {
    const credits = resourceRecord[pricingToResourceMap[fsPurchase.pricingId]] ?? 0;

    // Return sum total of 12 months of credits if annual billing cycle
    return fsPurchase.isAnnual() ? credits * 12 : credits;
}

async function getCreditsForUserPurchase(user: User, fsPurchase: PurchaseInfo): Promise<number> {
    let credits = 0;

    const isExisting = await prisma.userFsEntitlement.findUnique({
        where: { fsLicenseId: fsPurchase.licenseId },
    });

    if (!isExisting) {
        credits = getEntitledCredits(fsPurchase);
    }

    // Save purchase info in our DB
    await prisma.userFsEntitlement.upsert({
        where: { fsLicenseId: fsPurchase.licenseId },
        create: fsPurchase.toEntitlementRecord({ userId: user.id }),
        update: fsPurchase.toEntitlementRecord(),
    });

    return credits;
}

export async function syncEntitlementFromWebhook(fsLicenseId: string): Promise<void> {
    const purchaseInfo = await freemius.purchase.retrievePurchase(fsLicenseId);
    if (purchaseInfo) {
        await processPurchaseInfo(purchaseInfo);
    }
}

export async function deleteEntitlement(fsLicenseId: string): Promise<void> {
    await prisma.userFsEntitlement.delete({
        where: { fsLicenseId: fsLicenseId },
    });
}

export async function renewCreditsFromWebhook(fsLicenseId: string): Promise<void> {
    const purchaseInfo = await freemius.purchase.retrievePurchase(fsLicenseId);

    if (purchaseInfo) {
        const credits = getEntitledCredits(purchaseInfo);

        const entitlement = await prisma.userFsEntitlement.findUnique({
            where: { fsLicenseId },
        });

        if (entitlement && credits > 0) {
            await addCredits(entitlement.userId, credits);
        }
    }
}

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

const pricingToResourceMap: Record<string, keyof typeof resourceRecord> = {
    [process.env.FREEMIUS_PRICING_ID_STARTER!]: 'starter',
    [process.env.FREEMIUS_PRICING_ID_PROFESSIONAL!]: 'professional',
    [process.env.FREEMIUS_PRICING_ID_BUSINESS!]: 'business',
    [process.env.FREEMIUS_PRICING_ID_TOPUP_1000!]: 'topup_1000',
    [process.env.FREEMIUS_PRICING_ID_TOPUP_5000!]: 'topup_5000',
    [process.env.FREEMIUS_PRICING_ID_TOPUP_10000!]: 'topup_10000',
};

// #endregion

// Private helpers

export async function getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
}
