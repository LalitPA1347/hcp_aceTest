import { useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
 
const AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds
const SESSION_KEY = "activeSession"; // Key to store session data
 
const InactivityHandler = () => {
  const navigate = useNavigate();
  const timerRef = useRef(null); // Ref to store the timer ID, initialized to null
 
  // Handle logout and clear session data
  const handleLogout = useCallback(() => {
    localStorage.clear();
    sessionStorage.removeItem(SESSION_KEY);
    navigate("/"); // Navigate to login or home page
    window.location.reload();
  }, [navigate]);
 
  // Reset timer function
  const resetTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current); // Clear the previous timer if it exists
    }
    // Set a new timeout and store the ID in timerRef.current
    timerRef.current = window.setTimeout(() => {
      handleLogout();
    }, AUTO_LOGOUT_TIME);
  }, [handleLogout]);
 
  const handleBeforeUnload = useCallback((event) => {
    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, "true");
    } else {
      event.preventDefault();
      event.returnValue = ""; // Custom message for page close
    }
  }, []);
 
  useEffect(() => {
    // Activity events to reset the timer
    const events = ["click", "mousemove", "keydown", "scroll", "focus"];
 
    // Add event listeners for user activity
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
 
    // Add event listener for beforeunload (when tab is closed)
    window.addEventListener("beforeunload", handleBeforeUnload);
 
    // If session does not exist, log out the user
    if (!sessionStorage.getItem(SESSION_KEY)) {
      handleLogout();
    } else {
      resetTimer();
    }
 
    // Cleanup when component unmounts
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current); // Ensure we clean up the timeout
      }
    };
  }, [handleLogout, resetTimer, handleBeforeUnload]);
 
  return null;
};
 
export default InactivityHandler;
 