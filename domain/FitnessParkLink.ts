"use server";

export default async function loginToFitnessPark(
  username: string,
  password: string
): Promise<boolean> {
  const url = "https://services.virtuagym.com/v2/auth/login";
  const payload = { username, password };
  const headers = { "Content-Type": "application/json" };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      return false;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = await response.json();
    return data.accessToken !== null;
  } catch (error) {
    throw new Error("Failed to fetch access token");
  }
}
