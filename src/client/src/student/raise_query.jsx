import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/system";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState([]);
  const nav = useNavigate();
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleAttachmentsChange = (event) => {
    if (attachments.length === 5) {
      toast.error("Only 5 attachments allowed");
    } else {
      setAttachments((prevAttachments) => [
        ...prevAttachments,
        ...event.target.files,
      ]);
    }
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
      const res = await axios.post(
        "http://localhost:3001/api/student/queries/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // 'x-access-token': Cookies.get('token'),
          },
        }
      );
      if (res.status === 201) {
        toast.success("Query submitted successfully");
        nav("/student");
      }
    } catch (err) {
      console.log(err);
    }

    // const files = Array.from(attachments);
    // const base64Files = await Promise.all(files.map(file => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onloadend = () => resolve(reader.result);
    //         reader.onerror = reject;
    //         reader.readAsDataURL(file);
    //     });
    // }));

    // const data = {
    //     kerberos: Cookies.get('kerberos'),
    //     type: type,
    //     description: description,
    //     attachments: base64Files,
    // };

    // console.log(data);

    // fetch('http://localhost:3001/api/student/queries/create', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'x-access-token': Cookies.get('token'),
    //     },
    //     body: JSON.stringify(data),
    // })
    // .then(response => {
    //     if (response.status === 401|| response.status === 403) {
    //         alert('Unauthorized');
    //         nav('../../')
    //     } else {
    //         return response.json();
    //     }
    // }
    // ).then(data => {console.log(data);alert('Your query has been submitted successfully.');

    // nav('../')})
    // .catch((error) => {
    //     {console.error('Error:', error);alert('Attachment too large');}
    // });
  };

  return (
    <ThemeProvider theme={theme}>
      <FormContainer>
        <StyledForm onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom>
            Raise a Query
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
    </ThemeProvider>
  );
};

export default QueryForm;
