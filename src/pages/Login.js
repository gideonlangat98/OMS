import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OmsContext } from "../components/auth/AuthContext";

const Login = ({ onLogin, loggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {backendUrl} = useContext(OmsContext);
  const navigate = useNavigate();


  async function handleSubmit(event) {
    event.preventDefault();
  
    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.status === 200) {
        const user = await response.json();
        onLogin(user); // Pass the user object to the onLogin callback
  
        localStorage.setItem("user", JSON.stringify(user));
  
        // Redirect the user based on their role
        if (user.isadmin) {
          navigate("/admindashboard");
        } else if (user.isStaff) {
          navigate("/stdashboard");
        } else if(user.isManager) {
          navigate("/managerdashboard");
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid email or password");
      }
    } catch (error) {
      setError(error.message);
    }
  }
  

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'url("https://t3.ftcdn.net/jpg/05/06/79/02/240_F_506790264_N8BVZ9NLLRrTAShK6PADQmo0SZ4LUuJJ.jpg")',
      }}
    >
      <div className="p-8 bg-white/25 shadow-md rounded-md w-120">
        <h1 className="text-2xl text-center">Login</h1>
        {error && <div className="error">{error}</div>}
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 rounded-md p-3"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 rounded-md p-3"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md"
          >
            Login
          </button>
          <div className="border border-lightBlue rounded-md bg-transparent py-1 px-2 text-blue-500 text-center">
            <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
