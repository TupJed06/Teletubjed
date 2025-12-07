export default async function getFocuses() {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/focus`)
    if (!response.ok) {
        return new Error("Failed to fetch focuses")
    }

    return await response.json()
}