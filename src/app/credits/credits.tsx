'use client';

export default function Credits(props: { credits?: number; hasSubscription?: boolean }) {
    const { credits } = props;

    // Use Intl.NumberFormat to format the number with commas
    const formattedCredit = new Intl.NumberFormat().format(credits ?? 0);

    return (
        <div className="text-center">
            <h2 className="text-lg font-medium">You have {formattedCredit} credits</h2>
            <p className="mb-10 text-muted-foreground">You can purchase more credits below.</p>
        </div>
    );
}
