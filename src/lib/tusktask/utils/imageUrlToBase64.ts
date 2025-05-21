// utils/imageToBase64.js

/**
 * Converts an image URL to a base64-encoded string.
 * @param {string} imageUrl - The URL of the image.
 * @returns {Promise<string>} - A promise that resolves to the base64 string.
 */
export async function imageUrlToBase64(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Required for cross-origin image loading
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get 2D context from canvas."));
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "name" in error &&
          (error as any).name === "SecurityError"
        ) {
          reject(
            new Error(
              "Cannot convert image to base64 due to cross-origin restrictions."
            )
          );
        } else {
          const message =
            error && typeof error === "object" && "message" in error
              ? (error as any).message
              : String(error);
          reject(new Error("Failed to convert image to base64: " + message));
        }
      }
    };
    img.onerror = () =>
      reject(new Error("Failed to load image from URL: " + imageUrl));
    img.src = imageUrl;

    // Handle cached images that may not trigger onload
    if (img.complete || img.complete === undefined) {
      img.src =
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = imageUrl;
    }
  });
}
