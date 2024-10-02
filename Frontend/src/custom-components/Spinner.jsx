import React from "react";
import { HashLoader } from "react-spinners";
const Spinner = () => {
  return (
    <div className="w-full min-h-[600px] flex justify-center">
      <HashLoader size={130} color="#D6482b" />
    </div>
  );
};

export default Spinner;
