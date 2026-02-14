
import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./StudentScanner.css";

function StudentScanner() {
  const [token, setToken] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 220 },
      false
    );

    scanner.render(
      (decodedText) => {
        setToken(decodedText);
        scanner.clear();
      },
      (error) => {}
    );
  }, []);

  const getDeviceId = () => {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
};

  const submitAttendance = async () => {
    if (!rollNo.trim() || !name.trim()) {
    setIsError(true);
    setMessage("Please enter both Roll Number and Name ❌");
    return;
  }
  try {
    const deviceId = getDeviceId();

      const response = await fetch(`${BASE_URL}/api/attendance/mark?rollNo=${rollNo.trim()}&name=${name.trim()}&token=${token.trim()}&deviceId=${deviceId}`, {
      method: "POST"
    });

    const text = await response.text(); // backend message

    if (!response.ok) {
      setIsError(true);
      setMessage(text); // show real backend error
      return;
    }

    setIsError(false);
    setMessage("Attendance marked successfully ✅");

  } catch (error) {
    setIsError(true);
    setMessage("Server not reachable ❌");
  }
};


  return (
    <div className="scanner-container">
      <div className="scanner-card">
        <h2>Student Attendance</h2>

        {!token && <div id="reader"></div>}

        {token && (
          <>
            <input
              className="scanner-input"
              placeholder="Roll Number"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
            />

            <input
              className="scanner-input"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

          <button
          className="scanner-btn"
          onClick={submitAttendance}
          disabled={!rollNo.trim() || !name.trim()}
          >
          Submit Attendance
          </button>
          </>
        )}

        {message && (
          <p className={isError ? "error" : "success"}>{message}</p>
        )}
      </div>
    </div>
  );
}

export default StudentScanner;
