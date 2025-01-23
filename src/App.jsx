import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // For Chart.js registration

function App() {
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState(null);
  const [ecgData, setEcgData] = useState([]);
  const [highHeartRateAlert, setHighHeartRateAlert] = useState(false);
  const [lowHeartRateAlert, setLowHeartRateAlert] = useState(false);

  useEffect(() => {
    // Establish Socket.IO connection
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("connect", () => console.log("Socket.IO connected"));

    newSocket.on("publishingStarted", (e) => {
      console.log("e data:", e);
    });

    // Receive pacemaker data
    newSocket.on("pacemakerData", (receivedData) => {
      console.log("Received data:", receivedData);
      setData(receivedData);

      // Simulate ECG graph data
      const newEcgPoint = Math.sin(Date.now() / 1000) * 10 + 70; // Simulated sine wave
      setEcgData((prev) => [...prev.slice(-99), newEcgPoint]); // Keep the last 100 points

      // Check for alerts
      if (receivedData.anomalies.highHeartRate) {
        setHighHeartRateAlert(true);
      }
      if (receivedData.anomalies.lowHeartRate) {
        setLowHeartRateAlert(true);
      }
    });
    newSocket.on("disconnect", () => console.log("Socket.IO disconnected"));

    return () => newSocket.disconnect();
  }, []);

  const handleCloseAlert = () => {
    setHighHeartRateAlert(false);
    setLowHeartRateAlert(false);
  };

  // ECG chart data configuration
  const ecgChartData = {
    labels: Array.from({ length: ecgData.length }, (_, i) => i),
    datasets: [
      {
        label: "ECG Signal",
        data: ecgData,
        borderColor: "#3f51b5",
        backgroundColor: "rgba(63, 81, 181, 0.2)",
        fill: true,
      },
    ],
  };

  const ecgChartOptions = {
    scales: {
      x: { display: false },
      y: { min: 50, max: 100 },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        minWidth: "95vw",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Pacemaker Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Real-Time Data Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Real-Time Data</Typography>
              {data ? (
                <>
                 {/* Typography needed here */}
                  <Typography>
                    Location: {data.geoLocation.latitude},{" "}
                    {data.geoLocation.longitude}
                  </Typography>
                </>
              ) : (
                <Typography>Waiting for data...</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* ECG Graph */}
        <Grid item xs={12} sm={6} md={8}>
          <Card style={{ height: "300px" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ECG Graph
              </Typography>
              <div style={{ height: "250px" }}>
                <Line data={ecgChartData} options={ecgChartOptions} />
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts */}
        <Grid item xs={12}>
          {highHeartRateAlert && (
            <Alert onClose={handleCloseAlert} severity="error" variant="filled">
              High Heart Rate Detected!
            </Alert>
          )}
          {/* low heart rate display here */}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
