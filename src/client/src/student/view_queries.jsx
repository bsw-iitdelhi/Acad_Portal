import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Drawer,
  CircularProgress,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
const theme = createTheme({
  palette: {
    primary: {
      main: "#D93025", // Gmail's primary color
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif", // Gmail uses Arial
  },
});

// rest of your code

const drawerWidth = 240;

const MainContainer = styled(Box)(({ theme }) => ({
  display: "flex",
}));

const DrawerContainer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
}));

const DrawerPaper = styled("div")(({ theme }) => ({
  width: drawerWidth,
  padding: theme.spacing(2),
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const ViewQueries = () => {
  const [loading, notLoading] = useState(true);
  const [query, setQuery] = useState({});
  const params = new URLSearchParams(window.location.search);
  const { qid } = useParams();
  const navigate = useNavigate();
  const typeRef = useRef(null);
  const descriptionRef = useRef(null);
  const attachmentsRef = useRef(null);
  useEffect(() => {
    if (qid == null) {
      navigate("/student");
    }
    fetch(
      "http://localhost:3001/api/student/queries/one?qid=" +
        encodeURIComponent(qid) +
        "&kerberos=" +
        encodeURIComponent(Cookies.get("kerberos")),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          response.text().then((data) => {
            try {
              const jsonData = JSON.parse(data);
              setQuery(jsonData);
              notLoading(false);
            } catch (error) {
              console.error("Invalid JSON:", data);
            }
          });
        } else if (response.status === 401 || response.status === 403) {
          alert("Unauthorized");
          navigate("../../");
        } else {
          response.text().then((data) => {
            try {
              const jsonData = JSON.parse(data);
              console.log(jsonData);
            } catch (error) {
              console.error("Invalid JSON:", data);
            }
          });
        }
      })
      .catch((error) => console.error("Fetch Error:", error));
  }, []);

  const handleFabClick = () => {
    navigate("../query_feedback?qid=" + qid);
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <ThemeProvider theme={theme}>
          <MainContainer>
            <DrawerContainer variant="permanent">
              <DrawerPaper>
                <Typography variant="h6">Click to Scroll</Typography>
                <List>
                  <ListItem
                    button
                    onClick={() =>
                      typeRef.current.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <ListItemText primary="Type" />
                  </ListItem>
                  <ListItem
                    button
                    onClick={() =>
                      descriptionRef.current.scrollIntoView({
                        behavior: "smooth",
                      })
                    }
                  >
                    <ListItemText primary="Description" />
                  </ListItem>
                  <ListItem
                    button
                    onClick={() =>
                      attachmentsRef.current.scrollIntoView({
                        behavior: "smooth",
                      })
                    }
                  >
                    <ListItemText primary="Attachments" />
                  </ListItem>
                </List>
              </DrawerPaper>
            </DrawerContainer>
            <ContentContainer style={{ padding: "40px" }}>
              <Typography variant="h4" gutterBottom>
                Queries
              </Typography>
              <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="h6" gutterBottom ref={typeRef}>
                  {query.type}
                </Typography>
                <Typography variant="body1" gutterBottom ref={descriptionRef}>
                  <ReactMarkdown children={query.description} />
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  ref={attachmentsRef}
                >
                  Attachments:
                </Typography>
                <List>
                  {query.attachments.map((attachment, index) => (
                    <ListItem key={index}>
                      <img
                        src={`http://localhost:3001/uploads/queries/${attachment}`}
                        alt="☠️"
                        style={{ maxWidth: "100%" , maxHeight: "100%"}}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </ContentContainer>
          </MainContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFabClick}
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              borderRadius: "20px",
              padding: "12px 24px",
              fontSize: "18px",
              textTransform: "none",
              backgroundColor: "#3f51b5",
              "&:hover": {
                backgroundColor: "#303f9f",
              },
            }}
          >
            Feedback
          </Button>
        </ThemeProvider>
      )}
    </>
  );
};

export default ViewQueries;
