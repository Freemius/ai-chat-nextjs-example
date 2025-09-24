'use client';

import { Subscribe } from '@/react-starter/components/subscribe';
import { formatNumber } from '@/react-starter/utils/formatter';

export default function Credits(props: { credits?: number; hasSubscription: boolean }) {
    const { credits, hasSubscription } = props;

    const info = (
        <div className="text-center">
            <h2 className="text-lg font-medium">You have {formatNumber(credits ?? 0)} credits</h2>
            <p className="mb-10 text-muted-foreground">You can purchase more credits below.</p>
        </div>
    );

    return <Subscribe>{info}</Subscribe>;
}
