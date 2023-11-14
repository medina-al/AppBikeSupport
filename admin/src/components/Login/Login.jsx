import { useState } from "react";

// Material resources
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import ErrorAlert from "../shared/ErrorAlert";
// Custom resources
import "./styles/Login.css";
// API Services
import { loginUser } from '../../services/user';

function Login() {

  //Delete cookies

  document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "lastName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "email= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  
  //Validate Email
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Show and hide password
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  //Error

  const [error, setError] = useState(null);

  //Login
  async function LoginUser (){
    const response = await loginUser({ username, password });
    if (response.success) {
      setError(null);
      console.log(response.data);
      document.cookie = `token=${response.data.token}; max-age=1800; path=/; samesite=strict`;
      document.cookie = `userType=${response.data.user.type}; max-age=1800; path=/; samesite=strict`;
      document.cookie = `names=${response.data.user.names}; max-age=1800; path=/; samesite=strict`;
      document.cookie = `lastnames=${response.data.user.lastnames}; max-age=1800; path=/; samesite=strict`;
      document.cookie = `email=${response.data.user.email}; max-age=1800; path=/; samesite=strict`;
      document.cookie = `username=${response.data.user.username}; max-age=1800; path=/; samesite=strict`;
      document.cookie = `image_url=${response.data.user.image_url}; max-age=1800; path=/; samesite=strict`;
      document.cookie = `userId=${response.data.user.id}; max-age=1800; path=/; samesite=strict`;
      window.location.href='/index';
    }else{
      setError(response.response.data.title);
    }
  }

  return (
    <div
      className="mx-auto my-auto w-full login_background"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div className="login_box p-10 rounded-2xl bg-black bg-opacity-95 text-center">
        <img
          className="w-72 mx-auto"
          src="/logo_texto.png"
          alt="App Bike Support Logo"
        />
        <br />
        <h1 className="text-2xl">Inicio de sesión</h1>
        <br />
        <TextField
          id="input_email"
          label="Username or email"
          variant="filled"
          value={username}
          onChange={e=>setUsername(e.target.value)}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="start">
                <AlternateEmailIcon></AlternateEmailIcon>
              </InputAdornment>
            ),
          }}
          type="email"
          InputLabelProps={{ style: { color: "#fff" } }}
          required
          className="login_input"
        />
        <br />
        <br />
        <TextField
          id="input_password"
          label="Password"
          variant="filled"
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          type={showPassword ? "text" : "password"}
          InputLabelProps={{ style: { color: "#fff" } }}
          required
          onChange={e=>setPassword(e.target.value)}
          className="login_input"
        />
        <br />
        <br />
        <button
          variant="contained"
          className="w-full rounded-xl p-2 font-bold login_button"
          onClick={LoginUser}
        >
          Iniciar sesión
        </button>
        {error !== null && (
          <ErrorAlert data={error} />
        )}
      </div>
    </div>
  );
}

export default Login;
