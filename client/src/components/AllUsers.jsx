import * as React from "react";
import logo from "../assets/movies-sub.png";
import TextField from "@mui/material/TextField";
import { postData } from "../Utils/dbUtils";
import { useNavigate } from "react-router";
import useForm from "../hooks/useForm";
import { Link } from "react-router";
import CINEMA_SERVICE_URL from "../Config/config";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const AllUsers = () => {
  let navigate = useNavigate();

  return <></>;
};

export default AllUsers;
