import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Auth from "./Auth.jsx";
import { supabase } from "./supabaseClient";

function Root() {
  // undefined = still checking, null = logged out, object = logged in
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div style={{ padding: 40, fontFamily: "sans-serif", color: "#5B6960" }}>Loading…</div>;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px" }}>
        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            fontSize: 12,
            background: "none",
            border: "1px solid #C9CFC3",
            borderRadius: 6,
            padding: "5px 12px",
            cursor: "pointer",
            color: "#5B6960",
          }}
        >
          Log out
        </button>
      </div>
      <App />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
