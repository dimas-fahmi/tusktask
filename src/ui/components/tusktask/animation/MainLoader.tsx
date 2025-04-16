import Image from "next/image";
import React from "react";

const MainLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div>
        <Image
          width={150}
          height={150}
          src={"/images/loader.gif"}
          alt="Loading Animation"
        />
      </div>
    </div>
  );
};

export default MainLoader;
