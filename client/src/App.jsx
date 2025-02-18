import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import MainPage from "./components/MainPage";
import { Route, Routes } from "react-router-dom";
import UsersManagement from "./components/UsersManagement";
import AddUser from "./components/AddUser";
import UpdateUser from "./components/UpdateUser";
import AllUsers from "./components/AllUsers";
import Logout from "./components/Logout";
import { Provider } from "react-redux";
import store from "./redux/store";
import Movies from "./components/Movies";
import AllMovies from "./components/AllMovies";

function App() {
  return (
    <>
      <Provider store={store}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<MainPage />}>
            <Route path="usersmanagement" element={<UsersManagement />}>
              <Route path="adduser" element={<AddUser />}></Route>
              <Route path="updateuser/:userId" element={<UpdateUser />}></Route>
              <Route path="allusers" element={<AllUsers />}></Route>
            </Route>
            <Route path="movies" element={<Movies />}>
              <Route path="addmovie" element={<AddUser />}></Route>
              <Route
                path="updatemovie/:userId"
                element={<UpdateUser />}
              ></Route>
              <Route path="allmovies" element={<AllMovies />}></Route>
            </Route>
          </Route>
        </Routes>
      </Provider>
    </>
  );
}

export default App;
