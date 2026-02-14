
import { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import React, { useEffect } from 'react';

function AdminQR() {

  const [sessionName, setSessionName] = useState("");
  const [validMinutes, setValidMinutes] = useState(5);
  const [attendanceList, setAttendanceList] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [token, setToken] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL;

  const createSession = async () => {
    if (!sessionName.trim()) {
    alert("Session name is required");
    return;
  }

  if (validMinutes <= 0) {
    alert("Valid minutes must be greater than 0");
    return;
  }
    try {
      console.log("API URL:", import.meta.env.VITE_API_URL);
      const response = await axios.post(
        `${BASE_URL}/api/session/create`,
        null,
        {
          params: {
            sessionName: sessionName,
            validMinutes: validMinutes
          }
        }
      );

      setToken(response.data.token);
      setSessionId(response.data.sessionId);
    } catch (error) {
      alert("Error creating session");
    }
  };

  const fetchAttendance = async () => {
  if (!sessionId) return;

  const response = await fetch(`${BASE_URL}/api/attendance/session/${sessionId}`);
  const data = await response.json();
  setAttendanceList(data);
};

useEffect(() => {
  if (!sessionId) return;

  // Fetch immediately once
  fetchAttendance();

  // Auto refresh every 5 seconds
  const interval = setInterval(() => {
    fetchAttendance();
  }, 5000);

  // Cleanup when session changes or component unmounts
  return () => clearInterval(interval);

}, [sessionId]);


return (
  <div className="container">
    <h2>Create Attendance Session</h2>

    <label>Session Name: </label>
    <input
      type="text"
      placeholder="Session Name"
      value={sessionName}
      onChange={(e) => setSessionName(e.target.value)}
    /><br></br>

    <label>Expiry Time: </label>
    <input
      type="number"
      value={validMinutes}
      onChange={(e) => setValidMinutes(e.target.value)}
    /><br/>

    <button onClick={createSession}>Generate QR</button>

    {token && (
      <div className="qr-section">
        <h3>Scan this QR</h3>
        <QRCodeCanvas value={token} size={220} />
        <p className="token-text">{token}</p>
      </div>
    )}
  {sessionId && (
  <div className="attendance-section">
    <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
    Total Present: {attendanceList.length}
  </div>
    {attendanceList.length > 0 ? (
      <>
        <h3>Attendance List</h3>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {attendanceList.map((a) => (
              <tr key={a.attendanceId}>
                <td>{a.student.rollNo}</td>
                <td>{a.student.name}</td>
                <td>{new Date(a.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ) : (
      <p className="no-attendance">No students marked attendance yet.</p>
    )}
  </div>
)}


  </div>  
);



}

export default AdminQR;
