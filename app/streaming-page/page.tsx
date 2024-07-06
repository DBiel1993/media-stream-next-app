"use client";

import React from "react";

const UsersPage: React.FC = () => {
  const startStream = () => {
    // Add logic to start the video stream
    console.log("Start Stream button clicked");
  };

  const stopStream = () => {
    // Add logic to stop the video stream
    console.log("Stop Stream button clicked");
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <video id="video1" controls style={styles.video}></video>
        <video id="video2" controls style={styles.video}></video>
      </div>
      <div style={styles.buttonContainer}>
        <button
          style={{ ...styles.button, ...styles.start }}
          onClick={startStream}
        >
          Start Stream
        </button>
        <button
          style={{ ...styles.button, ...styles.stop }}
          onClick={stopStream}
        >
          Stop Stream
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    display: "flex",
    flexDirection: "column" as "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    margin: 0,
    backgroundColor: "#f0f0f0",
  },
  videoContainer: {
    display: "flex",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: "20px",
  },
  video: {
    width: "45%",
    height: "auto",
    backgroundColor: "#000",
    border: "1px solid #ccc",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    width: "30%",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  start: {
    backgroundColor: "#4CAF50",
    color: "white",
  },
  stop: {
    backgroundColor: "#f44336",
    color: "white",
  },
};

export default UsersPage;
