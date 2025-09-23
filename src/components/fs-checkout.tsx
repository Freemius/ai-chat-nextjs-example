'use client';

import { CheckoutProvider } from '@/react-starter/components/checkout-provider';
import { CheckoutSerialized } from '@freemius/sdk';
import { IconCircleCheck } from '@tabler/icons-react';
import * as React from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const handlePurchase = () => {
    toast.success(`Purchase successful`, {
        icon: <IconCircleCheck className="w-6 h-6 text-grow" />,
        description: 'You can now use the feature you just purchased.',
    });
};

export default function FSCheckoutProvider(props: { children: React.ReactNode; checkout: CheckoutSerialized }) {
    const router = useRouter();

    const onAfterSync = React.useCallback(() => {
        handlePurchase();
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
