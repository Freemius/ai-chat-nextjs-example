import { freemius } from '@/lib/freemius';
import { deleteEntitlement, renewCreditsFromWebhook, syncEntitlementFromWebhook } from '@/lib/user-entitlement';
import { WebhookEventType } from '@freemius/sdk';

const listener = freemius.webhook.createListener();

const licenseEvents: WebhookEventType[] = [
    'license.created',
    'license.extended',
    'license.shortened',
    'license.updated',
    'license.cancelled',
    'license.expired',
    'license.plan.changed',
];

listener.on(licenseEvents, async ({ objects: { license } }) => {
    if (license && license.id) {
        await syncEntitlementFromWebhook(license.id);
    }
});

listener.on('license.deleted', async ({ data }) => {
    await deleteEntitlement(data.license_id);
});

listener.on('license.extended', async ({ data }) => {
    if (data.is_renewal) {
        renewCreditsFromWebhook(data.license_id);
    }
});

const processor = freemius.webhook.createRequestProcessor(listener);

export { processor as POST };
