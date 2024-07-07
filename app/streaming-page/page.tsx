// pages/index.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

const UsersPage: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);
  const [localMuted, setLocalMuted] = useState<boolean>(false);
  const [remoteMuted, setRemoteMuted] = useState<boolean>(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onmessage = async (message) => {
      const data = JSON.parse(message.data);

      if (data.type === "offer") {
        const pc = new RTCPeerConnection();
        setPeerConnection(pc);

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current?.send(
              JSON.stringify({ type: "candidate", candidate: event.candidate })
            );
          }
        };

        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current?.send(JSON.stringify(pc.localDescription));
      } else if (data.type === "answer") {
        await peerConnection?.setRemoteDescription(
          new RTCSessionDescription(data)
        );
      } else if (data.type === "candidate") {
        await peerConnection?.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    };

    return () => {
      socketRef.current?.close();
    };
  }, [peerConnection]);

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

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.send(
            JSON.stringify({ type: "candidate", candidate: event.candidate })
          );
        }
      };

      setPeerConnection(pc);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.send(JSON.stringify(offer));

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

  const toggleMuteLocal = () => {
    if (localVideoRef.current) {
      localVideoRef.current.muted = !localVideoRef.current.muted;
      setLocalMuted(localVideoRef.current.muted);
    }
  };

  const toggleMuteRemote = () => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.muted = !remoteVideoRef.current.muted;
      setRemoteMuted(remoteVideoRef.current.muted);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.videoContainer}>
        <video
          ref={localVideoRef}
          id="localVideo"
          controls
          style={styles.video}
          autoPlay
        ></video>
        <video
          ref={remoteVideoRef}
          id="remoteVideo"
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
        <button style={styles.button} onClick={toggleMuteLocal}>
          {localMuted ? "Unmute Local" : "Mute Local"}
        </button>
        <button style={styles.button} onClick={toggleMuteRemote}>
          {remoteMuted ? "Unmute Remote" : "Mute Remote"}
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
    width: "60%",
    marginTop: "10px",
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
