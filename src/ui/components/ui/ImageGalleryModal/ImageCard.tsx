import { EllipsisIcon } from "lucide-react";
import Image from "next/image";

const ImageCard = () => {
  return (
    <div className="group/card relative max-w-[180px] cursor-pointer rounded-2xl overflow-hidden transition-all duration-300">
      {/* Image Container */}
      <div className="aspect-square relative">
        <Image
          layout={"fill"}
          src={
            "https://images.pexels.com/photos/34987930/pexels-photo-34987930.jpeg"
          }
          alt="Image"
          className="rounded-2xl group-hover/card:brightness-50 transition-all duration-300"
        />
      </div>

      {/* Metadata Container */}
      <div className="min-h-13 max-h-13">
        <h1>some_image_name.jpg</h1>
        <p className="text-sm font-light">2.5kb</p>
      </div>

      {/* Floating Button */}
      <button
        type="button"
        className="absolute top-2 right-2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 p-1 rounded-full bg-background text-foreground cursor-pointer hover:scale-95 active:scale-90"
      >
        <EllipsisIcon className="w-3 h-3" />
      </button>
    </div>
  );
};

export default ImageCard;
