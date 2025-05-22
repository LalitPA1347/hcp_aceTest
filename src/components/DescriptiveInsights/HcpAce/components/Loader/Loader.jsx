import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-backdrop">
      <div className="loader">
        <div></div> {/* Black circle */}
        <div></div> {/* Red circle */}
        <div></div> {/* Black circle */}
        <div></div> {/* Red circle */}
      </div>
    </div>
  );
};

export default Loader;