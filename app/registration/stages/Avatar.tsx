import AvatarUploader from "@/src/ui/components/tusktask/prefabs/AvatarUploader";
import React from "react";

const Avatar = () => {
  return (
    <div>
      <header>
        <h1 className={`text-2xl font-bold`}>Avatar</h1>
        <p className={`text-sm text-muted-foreground`}>
          Keep it as it is or upload a fresh avatar—it's all about your style
          and your decision!
        </p>
      </header>
      <div>
        <AvatarUploader />
      </div>
    </div>
  );
};

export default Avatar;
