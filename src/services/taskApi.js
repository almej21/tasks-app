const API_URL = "https://localhost:7083/api/customtasks/";

export async function fetchTasks() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return null;
  }
}

export async function saveTask(taskId, params) {
  try {
    const response = await fetch(`${API_URL}${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return null;
  }
}
