import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import MainPage from "./components/MainPage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </>
  );
}

export default App;
