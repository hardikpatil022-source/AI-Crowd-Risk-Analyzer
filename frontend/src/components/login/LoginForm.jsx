import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaArrowRight,
} from "react-icons/fa";

function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");

    if (!email || !password) {
      setLoading(false);
      setMessage("Please enter email and password.");
      return;
    }

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage(
        "Account created successfully! Now sign in."
      );
      setIsSignup(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    navigate("/dashboard");
  };

  const handleGoogleLogin = async () => {
  console.log("Google button clicked");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:5173/dashboard",
    },
  });

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    setMessage(error.message);
  }
};

  return (
    <section className="login-section">
      <div className="login-card">
        <h1>{isSignup ? "Create Account" : "Welcome Back"}</h1>

        <p className="subtitle">
          {isSignup
            ? "Create your account to continue"
            : "Sign in to your account to continue"}
        </p>

        <div className="form-group">
          <label>Email Address</label>

          <div className="input-wrapper">
            <FaEnvelope className="input-icon" />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Password</label>

          <div className="input-wrapper">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {!isSignup && (
          <div className="forgot-row">
            <a href="#">Forgot your password?</a>
          </div>
        )}

        {message && (
          <p
            style={{
              color: message.includes("successfully")
                ? "#22c55e"
                : "#ef4444",
              textAlign: "center",
              marginBottom: "18px",
              fontWeight: 600,
            }}
          >
            {message}
          </p>
        )}

        <button
          className="signin-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          <FaArrowRight />

          <span>
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Sign In"}
          </span>
        </button>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
        >
          <FaGoogle />

          <span>Sign in with Google</span>
        </button>

        <p className="signup-text">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            className="signup-link"
            onClick={() => {
              setMessage("");
              setIsSignup(!isSignup);
            }}
          >
            {isSignup ? " Sign In" : " Sign Up"}
          </button>
        </p>
      </div>
    </section>
  );
}

export default LoginForm;