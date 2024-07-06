"use client";

import React, { useRef, useState } from "react";

const UsersPage: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      setPeerConnection(pc);

      console.log("Start Stream button clicked");
    } catch (error) {
      console.error("Error starting stream: ", error);
    }
  };

  const stopStream = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    console.log("Stop Stream button clicked");
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <video
          ref={localVideoRef}
          id="video1"
          controls
          style={styles.video}
          autoPlay
        ></video>
        <video
          ref={remoteVideoRef}
          id="video2"
          controls
          style={styles.video}
          autoPlay
        ></video>
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
