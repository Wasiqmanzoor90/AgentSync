const isAuthorized = async () => {
  try {
    const res = await fetch("/api/auth/authentication", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // important to include cookies
    });

    const data = await res.json();

    if (res.ok && data.data) {
      localStorage.setItem("user", JSON.stringify(data.data));
      return data.data; //  matches API structure
    } else {
      return null;
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export default isAuthorized;
