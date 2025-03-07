import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";

const API_KEY = "YOUR_ALPHA_VANTAGE_API_KEY"; // Replace with your actual API key

const StockFetcher = () => {
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState("");

  const fetchStockData = async () => {
    if (!symbol) {
      setError("Please enter a stock symbol");
      return;
    }

    setError("");
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${API_KEY}`
      );
      const data = await response.json();

      if (data.Note) {
        setError("API limit reached. Try again later.");
        return;
      }

      if (!data.Symbol) {
        setError("Invalid stock symbol. Please try again.");
        return;
      }

      setStockData({
        name: data.Name,
        price: data["52WeekHigh"], // Alpha Vantage provides high/low, not real-time price
        peRatio: data.PERatio,
        currency: data.Currency,
      });
    } catch (err) {
      setError("Error fetching data. Please try again.");
    }
  };

  return (
    <Card sx={{ maxWidth: 400, margin: "20px auto", padding: "20px", textAlign: "center" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Stock Price Fetcher
        </Typography>
        <TextField
          label="Enter Stock Symbol"
          variant="outlined"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={fetchStockData}>
          Fetch Data
        </Button>

        {error && <Typography color="error">{error}</Typography>}

        {stockData && (
          <Card sx={{ marginTop: 2, padding: 2 }}>
            <Typography variant="h6">{stockData.name}</Typography>
            <Typography>
              <strong>Price:</strong> {stockData.price} {stockData.currency}
            </Typography>
            <Typography>
              <strong>P/E Ratio:</strong> {stockData.peRatio}
            </Typography>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default StockFetcher;
