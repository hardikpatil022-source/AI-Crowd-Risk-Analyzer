import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaArrowRight,
} from "react-icons/fa";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="login-section">

      <div className="login-card">

        <h1>Welcome Back</h1>

        <p className="subtitle">
          Sign in to your account to continue
        </p>

        {/* Email */}

        <div className="form-group">

          <label>Email Address</label>

          <div className="input-wrapper">

            <FaEnvelope className="input-icon" />

            <input
              type="email"
              placeholder="Enter your email"
            />

          </div>

        </div>

        {/* Password */}

        <div className="form-group">

          <label>Password</label>

          <div className="input-wrapper">

            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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

        <div className="forgot-row">
          <a href="#">Forgot your password?</a>
        </div>

        <button className="signin-btn">

          <FaArrowRight />

          <span>Sign In</span>

        </button>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <button className="google-btn">

          <FaGoogle />

          <span>Sign in with Google</span>

        </button>

        <p className="signup-text">

          Don't have an account?

          <a href="#"> Sign Up</a>

        </p>

      </div>

    </section>
  );
}

export default LoginForm;