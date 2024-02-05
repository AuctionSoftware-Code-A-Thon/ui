import { Button, CardActions } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function CustomCard(props) {
  const navigate = useNavigate();
  const {
    pid = "",
    pname = "",
    pdescription = "",
    purl = "",
    pCategory = "",
  } = props;
  const handleClick = (id) => {
    navigate("/project/" + id);
  };
  return (
    <Card
      sx={{ maxWidth: 345, maxHeight: 300 }}
      style={{ backgroundColor: "lightgray" }}
    >
      <CardHeader title={`${pname} (${pCategory})`} />
      <CardMedia component="img" height="100" image={purl} alt={"No image"} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {pdescription}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => handleClick(pid)}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
