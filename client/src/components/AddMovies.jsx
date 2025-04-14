import useForm from "../hooks/useForm";
import { Box, TextField, Typography, Button, Alert } from "@mui/material";
import { postData } from "../Utils/dbUtilsForSubscriptionsService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const AddMovies = () => {
  let navigate = useNavigate();
  const initForm = {
    name: "",
    genres: "",
    image: "",
    premiered: "",
    genresString: "",
  };

  const {
    handleInputChange,
    values,
    setValues,
    setErrors,
    errors,
    isFormSubmitted,
    setIsFormSubmitted,
    resetForm,
  } = useForm(initForm, "addMovieSchema");

  const labelWidth = "90px";

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (values.genresString)
      setValues({
        ...values,
        genres: values.genresString.split(",").map((genre) => genre.trim()),
      });
  }, [values.genresString]);

  const submitMovie = async (e) => {
    try {
      e.preventDefault();
      setIsFormSubmitted(true);
      setSuccessMessage("");
      setErrorMessage("");
      if (errors && Object.keys(errors).length > 0) {
        setErrorMessage("Check your error Please");
        return;
      }
      const { genresString, ...valuesWithoutGenresString } = values;
      const { data: movieAdded } = await postData(
        `/movies`,
        valuesWithoutGenresString
      );
      resetForm();
      setSuccessMessage("The Movie Added Successfully ");
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (
    <>
      <form onSubmit={(e) => submitMovie(e)}>
        <Box sx={{ dispaly: "on", my: 2 }}>
          <Typography variant="h5" component="h2">
            Add New Movie
          </Typography>
        </Box>
        <Box sx={{ mb: 0.5 }}>
          <label className="label" style={{ width: labelWidth }}>
            Name
          </label>
          <TextField
            sx={{ width: "300px" }}
            name="name"
            value={values.name}
            variant="outlined"
            size="small"
            onChange={(e) => handleInputChange(e)}
            {...(isFormSubmitted &&
              errors.name && {
                error: true,
                helperText: errors.name,
              })}
          />
        </Box>
        <br />
        <Box sx={{ mb: 0.5 }}>
          <label className="label" style={{ width: labelWidth }}>
            Genres
          </label>
          <TextField
            sx={{ width: "300px" }}
            name="genresString"
            value={values.genresString}
            variant="outlined"
            size="small"
            placeholder="Genres separated by commas "
            onChange={(e) => handleInputChange(e)}
            {...(isFormSubmitted &&
              errors.genresString && {
                error: true,
                helperText: errors.genresString,
              })}
          />
        </Box>
        <br />
        <Box sx={{ mb: 0.5 }}>
          <label className="label" style={{ width: labelWidth }}>
            Image URL
          </label>
          <TextField
            sx={{ width: "300px" }}
            name="image"
            value={values.image}
            variant="outlined"
            size="small"
            onChange={(e) => handleInputChange(e)}
            {...(isFormSubmitted &&
              errors.image && {
                error: true,
                helperText: errors.image,
              })}
          />
        </Box>
        <br />

        <br />

        <Box sx={{ mb: 0.5 }}>
          <label className="label" style={{ width: labelWidth }}>
            Premiered
          </label>

          <TextField
            sx={{ width: "150px" }}
            name="premiered"
            value={values.premiered}
            variant="outlined"
            size="small"
            placeholder="DD/MM/YYYY"
            onChange={(e) => handleInputChange(e)}
            {...(isFormSubmitted &&
              errors.premiered && {
                error: true,
                helperText: errors.premiered,
              })}
          />
        </Box>
        <br />
        {errorMessage && errorMessage != "" && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
        {successMessage && successMessage != "" && (
          <Alert severity="success">{successMessage}</Alert>
        )}
        <Box sx={{ display: "inline-block", mt: 2 }}>
          <Button
            variant="contained"
            size="large"
            type="submit"
            sx={{
              width: "80px",
              mr: 1,
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            size="large"
            sx={{
              width: "80px",
            }}
            onClick={() => navigate(`/movies/allmovies`)}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </>
  );
};

export default AddMovies;
