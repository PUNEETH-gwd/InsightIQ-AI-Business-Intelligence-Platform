import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome to InsightIQ 🚀</h1>

      <p>You are successfully logged in.</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Home;