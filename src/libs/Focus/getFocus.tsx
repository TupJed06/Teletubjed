export default async function getFocus(id:string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/focus/${id}`)
    if (!response.ok) {
        return new Error("Failed to fetch focus")
    }

    return await response.json()
    
}