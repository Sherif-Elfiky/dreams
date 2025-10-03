import { useSession, getSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Access denied. Please sign in.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <h2>Welcome, {session.user.name}!</h2>
      <p>Email: {session.user.email}</p>
      <img src={session.user.image} alt="Profile" width={100} />
      
      <div style={{ marginTop: "20px" }}>
        <h3>User Data Available:</h3>
        <pre>{JSON.stringify(session.user, null, 2)}</pre>
      </div>
    </div>
  );
}
