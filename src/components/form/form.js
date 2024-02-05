import { Grid, Paper, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { GlobalContext } from "../..";
import { SERVER_PORT, SERVER_URL } from "../../helpers/constants";

const validationSchema = yup.object().shape({
  pricing: yup.object().shape({
    hourly: yup.string().required("Hourly price is required"),
    perGame: yup.string().required("Per game price is required"),
  }),
  image: yup.object().shape({
    description: yup.string().required("Image description is required"),
    path: yup.string().required("Image path is required"),
  }),
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  type: yup.string().required("Type is required"),
  minimumAge: yup.number().required("Minimum age is required"),
});

const MyForm = () => {
  const { id } = useParams();
  const [isEdit, setEdit] = useState(id !== undefined);
  const { incrementLoading, decrementLoading } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [gameData, setGameData] = useState({
    name: "",
    description: "",
    type: "",
    minimumAge: "",
    pricing: {
      hourly: "",
      perGame: "",
    },
    image: {
      description: "",
      path: "",
    },
    isEdit: false,
  });
  const getTheGameData = async (id) => {
    incrementLoading();
    try {
      axios
        .post(
          `${SERVER_URL}:${SERVER_PORT}/project/get`,
          {
            pid: id,
          },
          {
            withCredentials: true,
          }
        )
        .then(
          (res) => {
            if (res?.data !== null) {
              setGameData(res?.data);
            } else {
              setEdit(false);
            }
          },
          (error) => {
            setEdit(false);
          }
        );
    } catch (error) {
      console.log(error);
    } finally {
      decrementLoading();
    }
  };

  useEffect(() => {
    if (id) {
      getTheGameData(id);
    }
    // eslint-disable-next-line
  }, [id]);
  useEffect(() => {
    formik.setValues({
      pricing: gameData?.pricing,
      image: gameData?.image,
      name: gameData?.name,
      description: gameData?.description,
      type: gameData?.type,
      minimumAge: gameData?.minimumAge,
    });
    // eslint-disable-next-line
  }, [gameData]);
  const formik = useFormik({
    initialValues: {
      pricing: gameData?.pricing,
      image: gameData?.image,

      name: gameData?.name,
      description: gameData?.description,
      type: gameData?.type,
      minimumAge: gameData?.minimumAge,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let res;
      if (!isEdit) {
        res = await axios.post(
          `${SERVER_URL}:${SERVER_PORT}/projects/create`,
          { ...values },
          {
            withCredentials: true,
          }
        );
      } else {
        res = await axios.post(
          `${SERVER_URL}:${SERVER_PORT}/projects/update`,
          { ...values },
          {
            withCredentials: true,
          }
        );
      }
      navigate(`/project/${res?.data?._id}`);
    },
  });
  const handleCancel = () => {
    if (isEdit) {
      navigate(`/project/${id}`);
    } else {
      navigate("/home");
    }
  };
  return (
    <Paper elevation={3} sx={{ marginRight: "2%", marginLeft: "2%" }}>
      <Box sx={{ padding: 5 }}>
        <Typography variant="h6" gutterBottom sx={{ paddingBottom: 5 }}>
          {!isEdit ? "New Game" : "Edit Game"}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="name"
                label="Title"
                name="name"
                required
                fullWidth
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={3}
                value={formik.values.description}
                required
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Type"
                name="type"
                fullWidth
                value={formik.values.type}
                required
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Minimum age"
                name="minimumAge"
                fullWidth
                value={formik.values.minimumAge}
                required
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Pricing (Hourly)"
                name="pricing.hourly"
                fullWidth
                value={formik.values.pricing.hourly}
                required
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Pricing (Per Game)"
                name="pricing.perGame"
                fullWidth
                value={formik.values.pricing.perGame}
                required
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image Path"
                name="image.path"
                fullWidth
                value={formik.values.image.path}
                required
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image alt text"
                name="image.description"
                fullWidth
                value={formik.values.image.description}
                onChange={formik.handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item>
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  );
};

export default MyForm;
