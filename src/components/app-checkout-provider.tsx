'use client';

import { CheckoutProvider } from '@/react-starter/components/checkout-provider';
import { CheckoutSerialized } from '@freemius/sdk';
import * as React from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function AppCheckoutProvider(props: { children: React.ReactNode; checkout: CheckoutSerialized }) {
    const router = useRouter();

    const onAfterSync = React.useCallback(() => {
        toast.success(`Successfully updated your subscription! Now you can continue using the app.`);
        router.refresh();
    }, [router]);

    return (
        <CheckoutProvider
            onAfterSync={onAfterSync}
            checkout={props.checkout}
            endpoint={process.env.NEXT_PUBLIC_APP_URL! + '/api/checkout'}
        >
            {props.children}
        </CheckoutProvider>
    );
}
