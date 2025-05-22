import React from "react";
import "./CommonLoader.css";

const CommonLoader = (props) => {
  return (
    <div className="loader">
      <div></div> {/* Black circle */}
      <div></div> {/* Red circle */}
      <div></div> {/* Black circle */}
      <div></div> {/* Red circle */}
    </div>
  );
};

export default CommonLoader;
