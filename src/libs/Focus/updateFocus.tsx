export default async function updateFocus(id: string, Data: object) {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/focus/${id}`, {
        method: "PUT",
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(Data),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update focus");
    }

    return data;
    
}
