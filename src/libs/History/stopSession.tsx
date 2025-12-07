export default async function stopSession(id: string, data: any) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/history/stopFocus/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("Stop Session Error:", error);
    return { success: false, message: "Network Error" };
  }
}