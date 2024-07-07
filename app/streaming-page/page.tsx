"use client";

import React, { useRef, useState } from "react";

const UsersPage: React.FC = () => {
  const localVideoRef1 = useRef<HTMLVideoElement>(null);
  const localVideoRef2 = useRef<HTMLVideoElement>(null);
  const remoteVideoRef1 = useRef<HTMLVideoElement>(null);
  const remoteVideoRef2 = useRef<HTMLVideoElement>(null);
  const [localStream1, setLocalStream1] = useState<MediaStream | null>(null);
  const [localStream2, setLocalStream2] = useState<MediaStream | null>(null);
  const [peerConnection1, setPeerConnection1] =
    useState<RTCPeerConnection | null>(null);
  const [peerConnection2, setPeerConnection2] =
    useState<RTCPeerConnection | null>(null);

  const startStream1 = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream1(stream);
      if (localVideoRef1.current) {
        localVideoRef1.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef1.current) {
          remoteVideoRef1.current.srcObject = event.streams[0];
        }
      };

      setPeerConnection1(pc);

      console.log("Start Stream 1 button clicked");
    } catch (error) {
      console.error("Error starting stream 1: ", error);
    }
  };

  const startStream2 = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream2(stream);
      if (localVideoRef2.current) {
        localVideoRef2.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        if (remoteVideoRef2.current) {
          remoteVideoRef2.current.srcObject = event.streams[0];
        }
      };

      setPeerConnection2(pc);

      console.log("Start Stream 2 button clicked");
    } catch (error) {
      console.error("Error starting stream 2: ", error);
    }
  };

  const stopStream = () => {
    if (localStream1) {
      localStream1.getTracks().forEach((track) => track.stop());
      setLocalStream1(null);
    }
    if (localStream2) {
      localStream2.getTracks().forEach((track) => track.stop());
      setLocalStream2(null);
    }
    if (peerConnection1) {
      peerConnection1.close();
      setPeerConnection1(null);
    }
    if (peerConnection2) {
      peerConnection2.close();
      setPeerConnection2(null);
    }
    console.log("Stop Stream button clicked");
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <video
          ref={localVideoRef1}
          id="video1"
          controls
          style={styles.video}
          autoPlay
        ></video>
        <video
          ref={remoteVideoRef1}
          id="video2"
          controls
          style={styles.video}
          autoPlay
        ></video>
        <video
          ref={localVideoRef2}
          id="video3"
          controls
          style={styles.video}
          autoPlay
        ></video>
        <video
          ref={remoteVideoRef2}
          id="video4"
          controls
          style={styles.video}
          autoPlay
        ></video>
      </div>
      <div style={styles.buttonContainer}>
        <button
          style={{ ...styles.button, ...styles.start }}
          onClick={startStream1}
        >
          Start Stream 1
        </button>
        <button
          style={{ ...styles.button, ...styles.start }}
          onClick={startStream2}
        >
          Start Stream 2
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
    width: "22%",
    height: "auto",
    backgroundColor: "#000",
    border: "1px solid #ccc",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    width: "50%",
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
