import React from "react";
import { Outlet } from "react-router-dom";
import InsuranceNavBar from "./insuranceNavBar/InsuranceNavBar";
import "./insuranceLayout.css";

const InsuranceLayout = () => {
  return (
    <div className="insurance-layout">
      <InsuranceNavBar />
      <div className="insurance-content">
        <Outlet /> {/* This will render the nested routes */}
      </div>
    </div>
  );
};

export default InsuranceLayout;
