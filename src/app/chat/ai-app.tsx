'use client';

import { useState } from 'react';
import LoginModal from '@/components/login-modal';
import { AIChat } from '@/components/ai-chat';

export default function AiApp(props: { examples: string[] }) {
    const { examples } = props;
    const [isShowingLogin, setIsShowingLogin] = useState<boolean>(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleApiError = (data: any) => {
        if (data.code === 'unauthenticated') {
            setIsShowingLogin(true);
        }
    };

    return (
        <>
            <LoginModal isShowing={isShowingLogin} onClose={() => setIsShowingLogin(false)} />

            <AIChat examples={examples} onApiError={handleApiError} />
        </>
    );
}
