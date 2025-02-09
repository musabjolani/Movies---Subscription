import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { removeToken } from "../redux/authSlice";

const Logout = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const logout = () => {
      dispatch(removeToken());
      navigate("/login");
    };

    logout();
  }, []);
};

export default Logout;
