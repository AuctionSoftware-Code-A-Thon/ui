import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalContext } from "../..";
import { SERVER_PORT, SERVER_URL } from "../../helpers/constants";
import ConfirmationModel from "../confirmation/confirmation";
import "./project.preview.css";
const ProjectPreview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [modelOpen, setModelOpen] = useState(false);
  const { incrementLoading, decrementLoading } = useContext(GlobalContext);

  const homePage = () => {
    navigate("/home");
  };
  const editPage = () => {
    navigate(`/project/${id}/edit`);
  };
  const handleClose = () => {
    setModelOpen(false);
  };
  const handleAccept = async () => {
    setModelOpen(false);
    incrementLoading();
    await axios.post(
      `${SERVER_URL}:${SERVER_PORT}/projects/delete`,
      { pid: id },
      {
        withCredentials: true,
      }
    );
    decrementLoading();
    navigate("/home");
  };
  useEffect(() => {
    if (id) {
      const getTheGameData = async (id) => {
        incrementLoading();
        const res = await axios.post(
          `${SERVER_URL}:${SERVER_PORT}/project/get`,
          { pid: id },
          {
            withCredentials: true,
          }
        );
        setProject(res?.data);
        decrementLoading();
      };
      getTheGameData(id);
    }
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      {project && (
        <Paper elevation={3} sx={{ marginRight: "2%", marginLeft: "2%" }}>
          <Box sx={{ padding: 5 }}>
            <Grid container>
              <Grid
                container
                direction={"row"}
                justifyContent={"space-between"}
              >
                <Grid item>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ paddingBottom: 5 }}
                  >
                    Project Details
                  </Typography>
                </Grid>
                <Grid item>
                  <Button variant="outlined" onClick={homePage}>
                    Home
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <img
                  height="200px"
                  className="image-container"
                  width="300px"
                  src={`${project?.purl}`}
                  alt={project?.image?.description}
                  title={project?.image?.description}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography paragraph>Name: {project?.pname}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography paragraph>
                  Description: {project?.pdescription}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography paragraph>
                  Category: {project?.pCategory}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography paragraph>Funds: {project?.funds}</Typography>
              </Grid>

              <Grid container direction={"row"} spacing={1}>
                <Grid item>
                  <Button variant="contained" onClick={editPage}>
                    Edit
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      setModelOpen(true);
                    }}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <ConfirmationModel
            title={"Are you sure to delete?"}
            subtitle={
              "Caution: Deleting this item is irreversible. Are you sure you want to proceed? Your decision cannot be undone."
            }
            open={modelOpen}
            no={handleClose}
            yes={handleAccept}
          />
        </Paper>
      )}
    </>
  );
};
export default ProjectPreview;
