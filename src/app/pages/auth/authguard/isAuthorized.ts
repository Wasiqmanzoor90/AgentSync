

const isAuthorized = async () => {
    try {
        const res = await fetch("/api/auth/authentication", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        });

          const data = await res.json();
      if (res.ok && data.verify) {
      localStorage.setItem("user", JSON.stringify(data.verify));
      return data.verify; // return the user object
    } else {
      return null;
    }
    } catch (error) {
        console.error("Token verification failed:", error);
        return false;
    }
};
export default isAuthorized;