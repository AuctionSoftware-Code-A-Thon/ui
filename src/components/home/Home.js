import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../..";
import { SERVER_PORT, SERVER_URL } from "../../helpers/constants";
import CustomCard from "../card/card";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [type, setType] = useState("All");
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [isDescendingOrder, setIsDescendingOrder] = React.useState(undefined);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchAllProjects(
      newPage,
      rowsPerPage,
      type !== "All" ? type : undefined,
      isDescendingOrder
    );
  };
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    fetchAllProjects(
      0,
      newRowsPerPage,
      type !== "All" ? type : undefined,
      isDescendingOrder
    );
  };

  const {
    projects,
    incrementLoading,
    decrementLoading,
    setProjects,
    typeFilter,
    setTypeFilter,
    setCurrentSessionActive,
  } = useContext(GlobalContext);
  const fetchAllProjects = (
    page = 0,
    rowsPerPage = 10,
    pCategory = undefined,
    isDescendingOrder = undefined
  ) => {
    incrementLoading();
    try {
      axios
        .post(
          `${SERVER_URL}:${SERVER_PORT}/projects/get/`,
          {
            pageNumber: page + 1,
            projectsPerPage: rowsPerPage,
            pCategory,
            isDataSorted: isDescendingOrder !== undefined ? true : false,
            isDescendingOrder,
          },
          {
            withCredentials: true,
          }
        )
        .then(
          (res) => {
            setProjects(res?.data?.projects);
            setTotalPages(res?.data?.totalPages);
            const uniqueTypes = [
              ...new Set(res?.data?.projects?.map((item) => item.pCategory)),
            ];
            setTypeFilter([...uniqueTypes, "All"]);
            decrementLoading();
          },
          (error) => {
            decrementLoading();
            console.log(error);
          }
        );
    } catch (error) {
      decrementLoading();
      console.log(error);
    }
  };
  const handleLogOut = async () => {
    await axios
      .get(`${SERVER_URL}:${SERVER_PORT}/auth/logout`, {
        withCredentials: true,
      })
      .then(
        (res) => {
          if (res.status === 200) {
            setCurrentSessionActive(false);
          }
        },
        (error) => {
          setCurrentSessionActive(false);
        }
      );
    navigate("/");
  };

  useEffect(() => {
    fetchAllProjects();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="container">
        <Grid2 container rowSpacing={1} columnSpacing={1} direction={"column"}>
          <Grid2>
            <Grid2
              container
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Grid2>
                <Typography variant="h6" gutterBottom color={"primary"}>
                  Home
                </Typography>
              </Grid2>
              <Grid2>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleLogOut();
                  }}
                >
                  logout
                </Button>
              </Grid2>
            </Grid2>
          </Grid2>
          <Grid2>
            <Typography variant="h3" gutterBottom>
              AuctionSoftware Code-A-Thon
            </Typography>
          </Grid2>
          <Grid2>
            <Typography variant="h6" gutterBottom>
              This are the list of projects are available with pagination and
              sort by category.
            </Typography>
          </Grid2>

          <Grid2 container direction={"row"} rowSpacing={1} columnSpacing={1}>
            <Grid2 xs={12} lg={4}>
              <FormControl fullWidth size="medium">
                <InputLabel id="type">Sort by category</InputLabel>
                <Select
                  labelId="sortByCategory"
                  id="sort"
                  value={
                    isDescendingOrder !== undefined
                      ? !isDescendingOrder
                        ? "ascending"
                        : "descending"
                      : "None"
                  }
                  label="sort"
                  onChange={(ele) => {
                    setIsDescendingOrder(
                      ele?.target?.value === "None"
                        ? undefined
                        : ele?.target?.value === "ascending"
                        ? false
                        : true
                    );
                    setPage(0);
                    fetchAllProjects(
                      0,
                      rowsPerPage,
                      type !== "All" ? type : undefined,
                      ele?.target?.value === "None"
                        ? undefined
                        : ele?.target?.value === "ascending"
                        ? false
                        : true
                    );
                  }}
                  style={{ backgroundColor: "white" }}
                >
                  {["None", "ascending", "descending"].map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 xs={12} lg={4}>
              <FormControl fullWidth size="medium">
                <InputLabel id="type">Type</InputLabel>
                <Select
                  labelId="type"
                  id="type"
                  value={type}
                  label="Age"
                  onChange={(ele) => {
                    setType(ele?.target?.value);
                    setPage(0);
                    fetchAllProjects(
                      0,
                      rowsPerPage,
                      ele?.target?.value !== "All"
                        ? ele?.target?.value
                        : undefined,
                      isDescendingOrder
                    );
                  }}
                  style={{ backgroundColor: "white" }}
                >
                  {typeFilter.map((item, index) => (
                    <MenuItem value={item} key={index}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>

            <Grid2 xs={6} lg={2}>
              <Button
                variant="outlined"
                style={{ backgroundColor: "white" }}
                onClick={() => {
                  navigate("/project/new");
                }}
              >
                Add project
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </div>
      <br />
      <div>
        {totalPages !== 0 && (
          <Grid2 container justifyContent="flex-end">
            <TablePagination
              component="div"
              count={totalPages * rowsPerPage}
              color="primary"
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid2>
        )}
        <Grid2 container>
          {projects &&
            projects.map((game) => (
              <Grid2 xs={12} md={6} lg={4} marginBlockEnd={3} key={game._id}>
                <CustomCard {...game} />
              </Grid2>
            ))}
        </Grid2>
        {totalPages !== 0 && (
          <Grid2 container justifyContent="flex-end">
            <TablePagination
              component="div"
              count={totalPages * rowsPerPage}
              color="primary"
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid2>
        )}
      </div>
    </>
  );
};
export default Home;
