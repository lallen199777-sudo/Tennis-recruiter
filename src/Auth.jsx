import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (mode === "signup") {
      setNotice("Check your email to confirm your account, then log in.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Recruiting Board</h1>
        <p style={styles.subtitle}>{mode === "signin" ? "Log in to your board" : "Create an account"}</p>

        <form onSubmit={submit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <div style={styles.error}>{error}</div>}
          {notice && <div style={styles.notice}>{notice}</div>}
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Working..." : mode === "signin" ? "Log in" : "Sign up"}
          </button>
        </form>

        <button
          style={styles.switchButton}
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError("");
            setNotice("");
          }}
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#EDF0E9",
    fontFamily: "sans-serif",
    padding: 20,
  },
  card: {
    background: "#FFFFFF",
    borderRadius: 10,
    padding: 28,
    width: "100%",
    maxWidth: 360,
    border: "1px solid #C9CFC3",
  },
  title: { margin: 0, color: "#14413D", fontSize: 22 },
  subtitle: { color: "#5B6960", fontSize: 14, marginTop: 4, marginBottom: 20 },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: {
    border: "1px solid #C9CFC3",
    borderRadius: 6,
    padding: "10px 12px",
    fontSize: 14,
  },
  button: {
    background: "#14413D",
    color: "#F4F2EA",
    border: "none",
    borderRadius: 6,
    padding: "10px 12px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    marginTop: 6,
  },
  switchButton: {
    marginTop: 14,
    background: "none",
    border: "none",
    color: "#14413D",
    fontSize: 13,
    cursor: "pointer",
    textDecoration: "underline",
  },
  error: { color: "#B23A2E", fontSize: 13 },
  notice: { color: "#2F6B33", fontSize: 13 },
};
