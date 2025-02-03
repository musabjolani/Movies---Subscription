import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import MainPage from "./components/MainPage";
import { Route, Routes } from "react-router-dom";
import UsersManagement from "./components/UsersManagement";
import AddUser from "./components/AddUser";
import UpdateUser from "./components/UpdateUser";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<MainPage />}>
          <Route path="usersmanagement" element={<UsersManagement />}>
            <Route path="adduser" element={<AddUser />}></Route>
            <Route path="updateuser/:userId" element={<UpdateUser />}></Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
