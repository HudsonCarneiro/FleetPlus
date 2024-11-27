import React, { useState } from "react";
import "../styles/Dashboard.css";
import UserTable from "./UserTable";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <section className="main">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
          </div>
        </div>
      )}
      <UserTable toggleModal={toggleModal} />
    </section>
  );
};

export default Dashboard;
