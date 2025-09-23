import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { deductCredits } from '@/lib/user-entitlement';
import { getAiResponse } from '@/lib/ai';

export async function POST(request: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return Response.json(
            {
                code: 'unauthenticated',
                message: 'You must be logged in to use this feature.',
            },
            { status: 401 }
        );
    }

    /**
     * Here you would implement the AI asset generation and credit consumption logic.
     * For demonstration, we will just return a dummy response and deduct 100 credits.
     */
    await deductCredits(session.user.id, 100);

    const data = await request.json();

    if (!data.message || typeof data.message !== 'string') {
        return Response.json(
            {
                code: 'invalid_input',
                message: 'Invalid input provided. Please provide a valid message.',
            },
            { status: 400 }
        );
    }

    return Response.json(
        {
            // Insert the actual AI asset generation logic here.
            message: getAiResponse(data.message),
        },
        {
            status: 200,
        }
    );
}
