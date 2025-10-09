'use client';

import { Subscribe } from '@/react-starter/components/subscribe';
import { Topup } from '@/react-starter/components/topup';

export default function Credits(props: { credits?: number; hasSubscription?: boolean }) {
    const { credits, hasSubscription } = props;

    const formattedCredit = new Intl.NumberFormat().format(credits ?? 0);

    const creditUi = (
        <div className="text-center">
            <h2 className="text-lg font-medium">You have {formattedCredit} credits</h2>
            <p className="mb-10 text-muted-foreground">You can purchase more credits below.</p>
        </div>
    );

    if (!hasSubscription) {
        return <Subscribe>{creditUi}</Subscribe>;
    }

    return <Topup>{creditUi}</Topup>;
}
