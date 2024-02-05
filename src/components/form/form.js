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
  pname: yup.string().required("Name is required"),
  pdescription: yup.string().required("Description is required"),
  pCategory: yup.string().required("Category is required"),
  funds: yup.string().required("Funds is required"),
  purl: yup.string().required("URL is required"),
});

const MyForm = () => {
  const { id } = useParams();
  const [isEdit, setEdit] = useState(id !== undefined);
  const { incrementLoading, decrementLoading } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [project, setProject] = useState({
    pid: "",
    pname: "",
    pdescription: "",
    pCategory: "",
    funds: "",
    purl: "",
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
              setProject(res?.data);
            } else {
              setEdit(false);
            }
          },
          (error) => {
            setEdit(false);
          }
        );
    } catch (error) {
      setEdit(false);
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
      pname: project?.pname,
      pdescription: project?.pdescription,
      pCategory: project?.pCategory,
      funds: project?.funds,
      purl: project?.purl,
    });
    // eslint-disable-next-line
  }, [project]);
  const formik = useFormik({
    initialValues: {
      pname: "",
      pdescription: "",
      pCategory: "",
      funds: "",
      purl: "",
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
      navigate(`/project/${res?.data?.pid}`);
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
          {!isEdit ? "New Project" : "Edit Project"}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="pname"
                label="Name"
                name="pname"
                required
                fullWidth
                value={formik.values.pname}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="pdescription"
                fullWidth
                multiline
                rows={3}
                value={formik.values.pdescription}
                required
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Category"
                name="pCategory"
                fullWidth
                value={formik.values.pCategory}
                required
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Funds"
                name="funds"
                fullWidth
                value={formik.values.funds}
                required
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="URL"
                name="purl"
                fullWidth
                value={formik.values.purl}
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
