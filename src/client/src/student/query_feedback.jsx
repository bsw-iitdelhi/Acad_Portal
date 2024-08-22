import React, { useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, TextField, Button } from '@mui/material';
import { styled } from '@mui/system';
import Cookies from 'js-cookie';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007BFF', // Gmail's primary color
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif', // Gmail uses Arial
  },
});

const FeedbackContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#fafafa', // light grey background
    padding: '2rem',
});

const FeedbackForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#fff', // white background
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // subtle shadow for depth
});

const StyledButton = styled(Button)({
    marginTop: '1rem',
    backgroundColor: '#007BFF', // Bootstrap primary color
    color: '#fff',
    '&:hover': {
        backgroundColor: '#0056b3',
    },
});

const QueryFeedback = () => {
    const [feedback, setFeedback] = useState('');
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);
    const qid = params.get("qid");
    useEffect(() => {
        if(qid == null) {
            navigate("/student");
        }
    }, []);
    const handleSubmit = (event) => {
        event.preventDefault();
        const data={
            feedback: feedback,
            kerberos: Cookies.get('kerberos')
        }
        fetch('http://localhost:3001/api/student/queries/resolve/'+qid, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
            body: JSON.stringify(data),
        }).then(response => {
            if (response.status === 401|| response.status === 403) {
                alert('Unauthorized');
                navigate('../../')
            } else {
                return response.json();
            }
        }
        ).then(() => {
            navigate('/student');
        }).catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    };
    return (
        <ThemeProvider theme={theme}>
        <FeedbackContainer>
            <Typography variant="h4" gutterBottom>Query Feedback</Typography>
            <FeedbackForm onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    multiline
                    rows={6}
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                    margin="normal"
                    required
                />
                <StyledButton type="submit" variant="contained">Submit</StyledButton>
            </FeedbackForm>
        </FeedbackContainer>
    </ThemeProvider>
    );
};

export default QueryFeedback;