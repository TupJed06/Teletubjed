export default async function getHistories() {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/history`)
    if (!response.ok) {
        return new Error("Failed to fetch histories")
    }

    return await response.json()
}