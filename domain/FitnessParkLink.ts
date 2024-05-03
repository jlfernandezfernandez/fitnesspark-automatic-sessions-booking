export default async function loginToFitnessPark(
  username: string,
  password: string
): Promise<boolean> {
  var isLinked = false;

  const url = "https://services.virtuagym.com/v2/auth/login";
  const payload = { username, password };
  const headers = { "Content-Type": "application/json" };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = await response.json();
    isLinked = data.accessToken && true;
  } catch (error) {
    console.error("Error obtaining access-token:", error);
  }
  return isLinked;
}
