import React, { useState, useRef, useEffect } from "react";
import "./index.css";

function PhoneVerification() {
  const [showPopup, setShowPopup] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [seconds, setSeconds] = useState(60);
  
  // Timer starts when popup is shown
  
  useEffect(() => {
    let interval = null;
    if (showPopup) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    }
    if (seconds === 0) {
      clearInterval(interval);
      setOtp(["", "", "", "", "", ""]);
      alert("OTP expired, please try again");
      setShowPopup(false);
      setSeconds(60);
    }
    return () => clearInterval(interval);
  }, [showPopup, seconds]);

  // Handle opening/closing of the popup
  function handleButtonClick() {
    setShowPopup(!showPopup);
  }

  // Handle OTP input change
  function handleOtpChange(e, index) {
    const value = e.target.value;
    // Only allow numeric values
    if (!isNaN(value) && value !== " ") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Move focus to next input
      if (value !== "" && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  }

  // Handle backspace
  function handleBackspace(e, index) {
    if (e.keyCode === 8 && otp[index] === "") {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      // Move focus to previous input
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  }

  // Handle arrow keys
  function handleArrowKeys(e, index) {
    if (e.keyCode === 37 && index > 0) {
      // Move focus to previous input on left arrow key press
      inputRefs.current[index - 1].focus();
    } else if (e.keyCode === 39 && index < inputRefs.current.length - 1) {
      // Move focus to next input on right arrow key press
      inputRefs.current[index + 1].focus();
    }
  }
  //Handle OTP verification
  function handleVerify(){
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      alert(`OTP verified: ${otpValue}`);
      setShowPopup(false);
      setOtp(["", "", "", "", "", ""]);
      setSeconds(60);
    } else {
      alert("Please enter a valid OTP");
    }
  };
  
  //Handle Paste 
  function handlePaste(e) {
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
    // console.logg(pasteData)
    const newOtp = [...otp];
    for (let i = 0; i < pasteData.length; i++) {
      if (!isNaN(pasteData[i])) {
        newOtp[i] = pasteData[i];
      }
    }
    setOtp(newOtp);
  }
  // Focus first input when popup is shown
  useEffect(() => {
    if (showPopup) {
      inputRefs.current[0].focus();
    }
  }, [showPopup]);
  
  let count = seconds>9 ? seconds : `0${seconds}`

  return (
    <div className="app-container">
      <button className="verify-button" onClick={handleButtonClick}>Verify Phone</button>
      {showPopup && (
        <div className="otp-popup-container">
          <h2 className="otp-heading">Phone Verification</h2>
          <p className="otp-note">Enter the OTP you received on 789383XXXX</p>
          <div className="otp-inputs">
            {otp.map((digit, index) => (
                <div className="input-box">
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                onKeyUp={(e) => handleArrowKeys(e, index)}
                onPaste={(e) => handlePaste(e)}
                ref={(ref) => (inputRefs.current[index] = ref)}
                className="otp-input"
              />
              </div>
            ))}
          </div>
          <div className="options-container">
            <p className="options">Change Number</p>
            <p className="options">Re-send OTP in 0:{count}</p>
          </div>
          <button className="otp-button" onClick={handleVerify}>Verify OTP</button>
        </div>
      )}
    </div>
  );
}

export default PhoneVerification