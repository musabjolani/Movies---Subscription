import useForm from "../hooks/useForm";
import { Box, TextField, Typography, Button, Alert } from "@mui/material";
import { getAll, updateById } from "../Utils/dbUtilsForSubscriptionsService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";

const UpdateMovie = () => {
  const { movieId } = useParams();

  let navigate = useNavigate();
  const initForm = {
    name: "",
    genres: "",
    image: "",
    premiered: "",
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
    const getMovie = async () => {
      const { data } = await getAll(`/movies/${movieId}`);

      const movie = {
        ...data,
        premiered: convertToEnGBDateFormat(data.premiered),
        genresString: data.genres.join(" , "),
      };
      setValues(movie);
    };

    getMovie();
  }, []);

  useEffect(() => {
    if (values.genresString)
      setValues({
        ...values,
        genres: values.genresString.split(",").map((genre) => genre.trim()),
      });
  }, [values.genresString]);

  const convertToEnGBDateFormat = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const submitMovie2 = async (e) => {
    try {
      e.preventDefault();
      setIsFormSubmitted(true);
      setSuccessMessage("");
      setErrorMessage("");
      if (errors && Object.keys(errors).length > 0) {
        setErrorMessage("Check your error Please");
        return;
      }
      const { genresString, ...movieValues } = values;

      const [dd, mm, yyyy] = values.premiered.split("/"); // Split "24/06/2013"
      movieValues.premiered = new Date(
        `${yyyy}-${mm}-${dd}T00:00:00.000Z`
      ).toISOString();
      const { data: movieUpdated } = await updateById(
        `/movies/${movieId}`,
        movieValues
      );
      resetForm();
      setSuccessMessage("The Movie Added Successfully ");
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      );
    }
  };

  const submitMovie = async (e) => {
    e.preventDefault();

    setIsFormSubmitted(true);
    setSuccessMessage("");
    setErrorMessage("");

    if (errors && Object.keys(errors).length > 0) {
      setErrorMessage("Please fix the errors before submitting.");
      return;
    }

    try {
      let { genresString, premiered, ...movieValues } = values;

      // ✅ Ensure `premiered` is in the correct format
      if (premiered && premiered.includes("/")) {
        let [dd, mm, yyyy] = premiered.split("/");

        // ✅ Ensure day & month are always two digits
        dd = dd.padStart(2, "0");
        mm = mm.padStart(2, "0");

        movieValues.premiered = new Date(
          `${yyyy}-${mm}-${dd}T00:00:00.000Z`
        ).toISOString();
      } else {
        setErrorMessage("Invalid Premiered Date format. Use DD/MM/YYYY.");
        return;
      }

      await updateById(`/movies/${movieId}`, movieValues);

      setSuccessMessage("Movie updated successfully!");
    } catch (error) {
      console.error("Error updating movie:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <>
      <form onSubmit={(e) => submitMovie(e)}>
        <Box sx={{ dispaly: "on", my: 2 }}>
          <Typography variant="h5" component="h2">
            Update Movie
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

export default UpdateMovie;
