import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Modal,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Box } from "@mui/system";
import { MentNav } from "./myNav";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [modQueries, setModQueries] = useState([]);

  // Mock data to replace fetch calls
  // const modQueries = [
  //   // { id: 1, title: "Query 1", status: "QUEUED" },
  //   // { id: 2, title: "Query 2", status: "RESOLVED" },
  // ];
  const fetechQueries = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/moderator/queries"
      );
      if (res.status === 200) {
        setModQueries(res.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetechQueries();
  }, []);

  const ongoingActivities = [
    { id: 3, title: "Activity 1", status: "AVAILABLE" },
    { id: 4, title: "Activity 2", status: "TAKEN" },
  ];

  const pastActivities = [
    { id: 5, title: "Past Activity 1", status: "DISMISSED" },
    { id: 6, title: "Past Activity 2", status: "APPROVED" },
  ];

  const handleItemClick = (item) => {
    setSelectedItem(item);
    console.log(selectedItem);
  };
  const handleApprove = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/api/moderator/queries/make_available/${id}`,
        {
          kerberos: Cookies.get("kerberos"),
        }
      );
      if (res.status === 200) {
        toast.success("Query Approved");
        fetechQueries();
        handleClose();
      }
    } catch (err) {
      toast.warn("Query already approved!");
      console.log(err);
    }
  };
  const handleReject = async (id) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/api/moderator/queries/dismiss/${id}`,
        {
          kerberos: Cookies.get("kerberos"),
        }
      );
      if (res.status === 200) {
        toast.success("Query Rejected");
        fetechQueries();
        handleClose();
      }
    } catch (err) {
      toast.warn("Query already dimsissed!");
      console.log(err);
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <MentNav />
      <div
        style={{ width: "100vw", height: "max-content", minHeight: "100vh" }}
      >
        {/* Integrated PrimarySearchAppBar */}
        {/* <PrimarySearchAppBar /> */}

        <Box sx={{ mx: "10%", mt: 4 }}>
          {/* Mod Action Awaited Section */}
          <Typography variant="h5" gutterBottom>
            Mod Action Awaited
          </Typography>
          <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
            {modQueries.length ? (
              modQueries.map((query) => (
                <Card key={query._id} sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="h6">{query.description}</Typography>
                    <Typography color="text.secondary">
                      {query.status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleItemClick(query)}>
                      View
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <CircularProgress />
            )}
          </Box>

          {/* Ongoing Activities Section */}
          <Typography variant="h5" gutterBottom mt={4}>
            Ongoing Activities
          </Typography>
          <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
            {ongoingActivities.length ? (
              ongoingActivities.map((activity) => (
                <Card key={activity.id} sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="h6">{activity.title}</Typography>
                    <Typography color="text.secondary">
                      {activity.status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleItemClick(activity)}
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <CircularProgress />
            )}
          </Box>

          {/* Past Activities Section */}
          <Typography variant="h5" gutterBottom mt={4}>
            Past Activities
          </Typography>
          <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
            {pastActivities.length ? (
              pastActivities.map((activity) => (
                <Card key={activity.id} sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography variant="h6">{activity.title}</Typography>
                    <Typography color="text.secondary">
                      {activity.status}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleItemClick(activity)}
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <CircularProgress />
            )}
          </Box>
        </Box>

        {/* Modal for viewing detailed information */}
        <Modal
          open={Boolean(selectedItem)}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Paper sx={{ p: 4, mx: "auto", mt: 8, maxWidth: 600 }}>
            {selectedItem && (
              <>
                <Typography id="modal-title" variant="h6" component="h2">
                  {selectedItem.title}
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                  Status: {selectedItem.status}
                </Typography>
                {/* Depending on the type of item, render different actions */}
                {(selectedItem.status === "QUEUED" ||
                  selectedItem.status === "DISMISSED") && (
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        handleApprove(selectedItem._id);
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ ml: 2 }}
                      onClick={() => {
                        handleReject(selectedItem._id);
                      }}
                    >
                      Reject
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Modal>
      </div>
    </>
  );
};

export default Dashboard;
