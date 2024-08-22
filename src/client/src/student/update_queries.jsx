import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import Cookies from "js-cookie";
import { json, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const theme = createTheme({
  palette: {
    primary: {
      main: "#007BFF", // Chegg's primary color
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif", // Chegg uses Arial
  },
});

const FormContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#fff", // white background
}));

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  maxWidth: "400px",
  padding: theme.spacing(3),
  borderRadius: "8px", // rounded corners
  boxShadow: theme.shadows[3],
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1, 0), // add some vertical spacing
  minWidth: 120,
  width: "100%",
}));

const QueryForm = () => {
  const navigate = useNavigate();
  const { qid } = useParams();
  const [loading, notLoading] = useState(true);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState([]);
  const nav = useNavigate();
  const [id, setId] = useState("");
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAttachmentsChange = (event) => {
    setAttachments(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("kerberos", Cookies.get("kerberos"));
    formData.append("type", type);
    formData.append("description", description);
    Array.from(attachments).forEach((file) => {
      formData.append("attachments", file);
    });
    try {
      console.log(id);
      let res = await axios.patch(
        `http://localhost:3001/api/student/queries/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // "x-access-token": Cookies.get("token"),
          },
        }
      );
      if (res.status === 401 || res.status === 403) {
        toast.warn("Unauthorized");
        nav("/student");
      }
      if (res.status === 200) {
        toast.success("Query updated successfully");
        nav("/student");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error updating query");
    }
  };
  useEffect(() => {
    if (qid == null) {
      navigate("/student");
    }
    fetch(
      "http://localhost:3001/api/student/queries/queued?qid=" +
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
              setType(jsonData.type);
              setDescription(jsonData.description);
              notLoading(false);
              setId(jsonData._id);
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

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <CircularProgress />
      ) : (
        <FormContainer>
          <StyledForm onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom>
              Update the Query
            </Typography>
            <StyledFormControl>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                value={type}
                onChange={handleTypeChange}
              >
                <MenuItem value={"General"}>General</MenuItem>
                <MenuItem value={"CML101"}> CML101</MenuItem>
                <MenuItem value={"APL100"}> APL100</MenuItem>
                <MenuItem value={"ELL100"}> ELL100</MenuItem>
                <MenuItem value={"PYL101"}> PYL101</MenuItem>
                <MenuItem value={"COL100"}> COL100</MenuItem>
                <MenuItem value={"MTL101"}> MTL101</MenuItem>
                <MenuItem value={"MTL100"}> MTL100</MenuItem>
                <MenuItem value={"MCP101"}> MCP101</MenuItem>
                <MenuItem value={"MCP100"}> MCP100</MenuItem>
                <MenuItem value={"PYP"}> PYP</MenuItem>
              </Select>
            </StyledFormControl>
            <TextField
              id="description"
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              variant="outlined"
              fullWidth
              style={{ margin: "1rem 0" }}
            />
            <Box sx={{ margin: "1rem 0" }}>
              <InputLabel htmlFor="attachments">Attachments</InputLabel>
              <input
                id="attachments"
                type="file"
                multiple
                onChange={handleAttachmentsChange}
                style={{ display: "none" }}
              />
              <Box display="flex">
                <label htmlFor="attachments">
                  <Button variant="contained" component="span">
                    Upload
                  </Button>
                </label>
                {attachments.length > 0 && (
                  <Box ml={2} display="flex" flexWrap="wrap">
                    {Array.from(attachments).map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        style={{ margin: "0 4px" }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit
            </Button>
          </StyledForm>
        </FormContainer>
      )}
    </ThemeProvider>
  );
};

export default QueryForm;
