// lib/fetchUsers.js

export async function fetchUsersFromBackend() {
  try {
    const response = await fetch("http://localhost:3007/api/users");
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
}
