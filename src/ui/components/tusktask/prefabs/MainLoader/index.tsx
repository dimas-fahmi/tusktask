import Image from "next/image";
import React from "react";

const MainLoader = () => {
  return (
    <div className="absolute bg-background inset-0 flex items-center justify-center">
      <div>
        <Image
          width={80}
          height={80}
          src={"/images/loader.gif"}
          alt="loading animation"
          unoptimized
        />
      </div>
    </div>
  );
};

export default MainLoader;
