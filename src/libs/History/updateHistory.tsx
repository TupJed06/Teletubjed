
export default async function updateHistory(id:string) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/history/${id}`, {
        method: "PUT",
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update history");
    }

    return data;
    
}
