export default async function getHistory(id:string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/history/${id}`)
    if (!response.ok) {
        return new Error("Failed to fetch history")
    }

    return await response.json()
    
}