import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-card">
        <h1>QR Attendance System</h1>
        <p>Select your role</p>

        <div className="home-buttons">
          <button onClick={() => navigate("/admin")}>
            Admin
          </button>

          <button onClick={() => navigate("/student")}>
            Student
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
