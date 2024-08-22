// Modify the given code for mentor whose code look like somethinhg like this:-
// src/MentorDashboard.js
import {
  AppBar,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Paper,
  Typography,
  Modal,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Button } from "@material-tailwind/react";
import LoupeIcon from "@mui/icons-material/Loupe";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { MentNav } from "../mod/myNav";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const Dashboard = () => {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([{}]);
  const [opportunities, setOpportunities] = useState([{}]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [mentId, setMentId] = useState("");

  const checkAuth = ()=>{
    // if(Cookies.get('kerberos') === undefined)
    // {
    //   navigate('/mentor/login')
    // }
  }


  const fetchQueries = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/mentor/queries/");
      setQueries(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchOpportunities = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/mentor/opportunity/`
      );
      if (res.status === 200) {
        setOpportunities(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchMentorId = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3001/api/mentor/auth/details/${Cookies.get(
          "kerberos"
        )}`
      );
      if (res.status === 200) {
        setMentId(res.data._id);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    // checkAuth();
    fetchMentorId();
    fetchQueries();
    fetchOpportunities();
  }, []);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };
  const handleTakeQuery = async () => {
    console.log(selectedItem);
    try {
      const res = await axios.post(
        `http://localhost:3001/api/mentor/queries/${selectedItem._id}`,
        {
          kerberos: Cookies.get("kerberos"),
        }
      );
      if (res.status === 200) {
        console.log("Query taken successfully");
        fetchQueries();
        toast.success("Query taken successfully");
      }
    } catch (err) {
      console.log(err);
      toast.warn("Error taking query");
    }
  };
  const handleTakeOppurtunity = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3001/api/mentor/opportunity/take/${selectedItem._id}`,
        {
          kerberos: Cookies.get("kerberos"),
        }
      );
      if (res.status === 200) {
        toast.success("Opportunity taken successfully");
      }
      console.log(res.data);
    } catch (err) {
      toast.warn("Expired!");
      console.log(err);
    }
  };

  const renderModalContent = () => {
    console.log(selectedItem);
    if (!selectedItem) return null;

    switch (selectedItem.type) {
      case "takenQuery":
        return (
          <>
            <Typography variant="h6">
              Info: {selectedItem.description}
            </Typography>
            <Typography variant="body1">
              Contact: {selectedItem.phone_number}
            </Typography>
          </>
        );
      case "availableQuery":
        return (
          <>
            <Typography variant="h6">Query Details</Typography>
            <Typography variant="body1">
              Description: {selectedItem.description}
            </Typography>
            {selectedItem.attachments &&
              selectedItem.attachments.length > 0 && (
                <>
                  <Typography variant="body1">Attachments:</Typography>
                  {selectedItem.attachments.map((attachment, index) => (
                    <img
                      key={index}
                      src={attachment}
                      alt={`Attachment ${index + 1}`}
                      style={{ maxWidth: "100%", marginBottom: "10px" }}
                    />
                  ))}
                </>
              )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleTakeQuery}
            >
              Take Up
            </Button>
            <Button
              variant="contained"
              onClick={() => console.log("View Query")}
            >
              View Query
            </Button>
          </>
        );
      case "floatedOpportunity":
        return (
          <>
            <Typography variant="h6">
              Info: {selectedItem.description}
            </Typography>
            {selectedItem.status === "available" ? (
              <>
                <Button variant="contained">Edit</Button>
                <Button variant="contained" color="secondary">
                  Delete
                </Button>
              </>
            ) : (
              <Typography variant="body1">
                Taken by: {selectedItem.taker ? selectedItem.taker : "No one"}
              </Typography>
            )}
          </>
        );
      case "otherOpportunity":
        return (
          <>
            <Typography variant="h6">
              Info: {selectedItem.description}
            </Typography>
            <Typography variant="h7">
              Created By: {selectedItem.creator}
            </Typography>
            <Typography variant="h7">End: {selectedItem.end}</Typography>

            <Button variant="contained" onClick={handleTakeOppurtunity}>
              Take Up
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: "100vw", height: "max-content", minHeight: "100vh" }}>
      <MentNav />
      <Box
        display="flex"
        flexDirection="column"
        marginTop="40px"
        sx={{ mx: "10%" }}
      >
        <Card sx={{ minWidth: 150, width: 300, my: "30px" }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Get started
            </Typography>
            <Typography variant="h5" component="div">
              Actions
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              startIcon={<LoupeIcon />}
              variant="contained"
              onClick={() => navigate("/mentor/mark_attendance")}
            >
              Mark Attendance
            </Button>
            <Button
              size="small"
              startIcon={<LoupeIcon />}
              variant="contained"
              onClick={() => navigate("/mentor/float_opportunity")}
            >
              Float Opportunity
            </Button>
          </CardActions>
        </Card>

        <Typography variant="h5" component="div">
          Taken Queries
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          width="100%"
          sx={{
            borderRadius: "20px",
            bgcolor: "#f2f0f5",
            py: "30px",
            mb: "30px",
          }}
          alignItems={!queries && "center"}
        >
          {queries ? (
            queries
              .filter((q) => q.status === "TAKEN")
              .map((query) => (
                <ListItem
                  button
                  key={query._id}
                  onClick={() => handleOpen({ ...query, type: "takenQuery" })}
                >
                  <ListItemText primary={query.description} />
                </ListItem>
              ))
          ) : (
            <CircularProgress />
          )}
        </Box>

        <Typography variant="h5" component="div">
          Available Queries
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          width="100%"
          sx={{
            borderRadius: "20px",
            bgcolor: "#f2f0f5",
            py: "30px",
            mb: "30px",
          }}
          alignItems={!queries && "center"}
        >
          {queries ? (
            queries
              .filter((q) => q.status === "AVAILABLE")
              .map((query) => (
                <ListItem
                  button
                  key={query._id}
                  onClick={() =>
                    handleOpen({ ...query, type: "availableQuery" })
                  }
                >
                  <ListItemText primary={query.description} />
                </ListItem>
              ))
          ) : (
            <CircularProgress />
          )}
        </Box>

        <Typography variant="h5" component="div">
          Floated Opportunities
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          width="100%"
          sx={{
            borderRadius: "20px",
            bgcolor: "#f2f0f5",
            py: "30px",
            mb: "30px",
          }}
          alignItems={!opportunities && "center"}
        >
          {opportunities ? (
            opportunities
              .filter((op) => op.creator === Cookies.get("mentId"))
              .map((opportunity) => (
                <ListItem
                  button
                  key={opportunity._id}
                  onClick={() =>
                    handleOpen({ ...opportunity, type: "floatedOpportunity" })
                  }
                >
                  <ListItemText primary={opportunity.description} />
                </ListItem>
              ))
          ) : (
            <CircularProgress />
          )}
        </Box>

        <Typography variant="h5" component="div">
          Other Opportunities
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          flexDirection="column"
          width="100%"
          sx={{
            borderRadius: "20px",
            bgcolor: "#f2f0f5",
            py: "30px",
            mb: "30px",
          }}
          alignItems={!opportunities && "center"}
        >
          {opportunities ? (
            opportunities
              .filter((op) => op.creator !== Cookies.get("mentId"))
              .map((opportunity) => (
                <ListItem
                  button
                  key={opportunity._id}
                  onClick={() =>
                    handleOpen({ ...opportunity, type: "otherOpportunity" })
                  }
                >
                  <ListItemText primary={opportunity.description} />
                </ListItem>
              ))
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {renderModalContent()}
        </Box>
      </Modal>
    </div>
  );
};

export default Dashboard;



     