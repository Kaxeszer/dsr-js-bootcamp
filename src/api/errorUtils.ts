interface BackendErrorBody {
    message: string | string[]
}

function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export async function extractErrorMessage(
    response: Response,
    fallback: string,
    forbiddenMessage?: string
): Promise<string> {
    if (response.status === 403 && forbiddenMessage) {
        return forbiddenMessage
    }
    try {
        const body: BackendErrorBody = await response.json()
        if (Array.isArray(body.message)) {
            return body.message.map(capitalize).join('\n')
        }
        if (typeof body.message === 'string') {
            return capitalize(body.message)
        }
    } catch {
        // response body wasn't valid JSON, fall through to fallback
    }
    return fallback
}