import HeroSection from "../components/login/HeroSection";
import LoginForm from "../components/login/LoginForm";
import "../styles/login.css";

function Login() {
  return (
    <main className="login-page">
      <HeroSection />
      <LoginForm />
    </main>
  );
}

export default Login;