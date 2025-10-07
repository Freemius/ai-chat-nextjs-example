/**
 * This route handles the Purchase actions and sync actions coming from the Freemius React Starter Kit.
 */
import { freemius } from '@/lib/freemius';
import { processPurchaseInfo } from '@/lib/user-entitlement';

const processor = freemius.checkout.request.createProcessor({
    onPurchase: processPurchaseInfo,
});

export { processor as GET, processor as POST };
