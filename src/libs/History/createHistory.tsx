
export default async function createHistory(Data: object) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/history/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Data),
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create history");
    }

    return data;
    
}
