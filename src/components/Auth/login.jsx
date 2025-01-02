import { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import "../../styles/Login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        { email, password }
      );

      const { token, name, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("role", role);

      setLoading(false);

      if (role === "admin") {
        navigate("/Admin/dashboard");
      } else if (role === "user") {
        navigate("/User/home");
      } else {
        setError("Role tidak dikenali, hubungi admin.");
      }
      
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Login gagal, periksa kembali email dan password.");
      } else {
        setError("Terjadi kesalahan, coba lagi nanti.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="card-wrapper">
        <div className="card p-4 shadow login-card">
          <h2 className="text-center mb-4 fade-in">Login</h2>
          <form onSubmit={handleSubmit} className="slide-in">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-danger text-center fade-in">{error}</p>}
            <button
              type="submit"
              className="btn btn-primary w-100 pulse-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="text-center mt-3 fade-in">
            <span>
              Belum punya akun? {" "}
              <NavLink
                to="/register"
                className="register-link"
              >
                Daftar di sini
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
