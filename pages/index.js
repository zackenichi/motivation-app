import { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const API_URL = 'https://api.quotable.io/random';

const useStyles = makeStyles({
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function Home() {
  const classes = useStyles();

  const [quote, setQuote] = useState('');
  const [nextQuoteTime, setNextQuoteTime] = useState(
    Date.now() + 10 * 60 * 1000
  ); // 10 minutes in milliseconds
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeLeft = Math.max(0, Math.round((nextQuoteTime - now) / 1000));
      setTimeLeft(timeLeft);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [nextQuoteTime]);

  const fetchQuote = async () => {
    setLoading(true);
    const response = await axios.get(API_URL);
    setQuote(response.data.content);
    setNextQuoteTime(Date.now() + 10 * 60 * 1000);
    setLoading(false);
  };

  const handleNewQuote = () => {
    fetchQuote();
    setNextQuoteTime(Date.now() + 10 * 60 * 1000);
  };

  const handleTimeLeft = (timeLeft) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Grid container spacing={2} alignItems="center" alignContent="center">
        <Grid item xs={12}>
          <Typography variant="h4">Daily Motivation</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="body1"
            style={{ fontSize: '20px', fontWeight: 'bold' }}
          >
            &ldquo; {loading ? 'Loading...' : quote}&rdquo;
          </Typography>
        </Grid>

        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={handleNewQuote}>
            New Quote
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body1">
            {timeLeft > 0
              ? `Next quote in ${handleTimeLeft(timeLeft)}`
              : 'Fetching new quote...'}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
