import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  // Fetch protected data when user is authenticated
  useEffect(() => {
    if (session) {
      fetch("/api/user/profile")
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(err => console.error("Failed to fetch user data:", err));
    }
  }, [session]);

  if (status === "loading") {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px", padding: "20px" }}>
      {!session ? (
        <>
          <h1>Welcome to Dreams App</h1>
          <p>Please sign in to access your dashboard</p>
          <button 
            onClick={() => signIn("google")}
            style={{ 
              padding: "10px 20px", 
              fontSize: "16px",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Sign in with Google
          </button>
        </>
      ) : (
        <>
          <h1>Welcome back, {session.user.name}!</h1>
          <img src={session.user.image} alt="profile pic" width={80} style={{ borderRadius: "50%" }} />
          <p>Email: {session.user.email}</p>
          
          <div style={{ margin: "20px 0" }}>
            <button 
              onClick={() => router.push("/dashboard")}
              style={{ 
                padding: "10px 20px", 
                margin: "0 10px",
                fontSize: "16px",
                backgroundColor: "#34a853",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => signOut()}
              style={{ 
                padding: "10px 20px", 
                margin: "0 10px",
                fontSize: "16px",
                backgroundColor: "#ea4335",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Sign out
            </button>
          </div>

          {userData && (
            <div style={{ marginTop: "20px", textAlign: "left", maxWidth: "500px", margin: "20px auto" }}>
              <h3>Protected Data from API:</h3>
              <pre style={{ backgroundColor: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
