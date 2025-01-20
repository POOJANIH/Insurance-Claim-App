import React, { useState, useEffect } from "react";
import "./notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Simulate fetching notifications from an API
    const fetchNotifications = () => {
      const simulatedNotifications = [
        { id: 1, message: "Your claim has been approved!" },
        { id: 2, message: "New updates are available for your policy." },
        { id: 3, message: "Please upload additional documents for verification." },
      ];
      setNotifications(simulatedNotifications);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      {notifications.length > 0 ? (
        <ul className="notifications-list">
          {notifications.map((notification) => (
            <li key={notification.id} className="notification-item">
              {notification.message}
            </li>
          ))}
        </ul>
      ) : (
        <p>No new notifications.</p>
      )}
    </div>
  );
};

export default Notifications;
