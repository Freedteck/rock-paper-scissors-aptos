import React from "react";
import close from "../assets/icon-close.svg";

const Waiting: React.FC = () => {
  return (
    <div className={`close`}>
      <img src={close} alt={`close icon`} />
    </div>
  );
};

export default Waiting;
