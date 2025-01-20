import React from "react";
import { Outlet } from "react-router-dom";
import GarageNavBar from "./garageNavBar/GarageNavBar";
import "./garageLayout.css";

const GarageLayout = () => {
  return (
    <div className="garage-layout">
      <GarageNavBar />
      <div className="garage-content">
        <Outlet /> {/* This will render the nested routes */}
      </div>
    </div>
  );
};

export default GarageLayout;
