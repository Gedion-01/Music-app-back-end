import { Request, Response, NextFunction } from "express";

const ONEMB = 1024 * 1024; // equivalent to 1MB

export const fileSizeLimiter = (imagesize: number, audiosize: number) => {
  const IMAGE_FILE_SIZE_LIMIT = imagesize * ONEMB; // max file size in MB
  const AUDIO_FILE_SIZE_LIMIT = audiosize * ONEMB; // max file size in MB
  

  return (req: Request, res: Response, next: NextFunction) => {
    const files: any = req.files;

    const imageFile: any = files["image"] ? files["image"][0] : null;
    const audioFile: any = files["audio"] ? files["audio"][0] : null;

    const FileSizeOverLimit = [];

    if (imageFile.size > IMAGE_FILE_SIZE_LIMIT) {
      const message = `The selected image is bigger than ${imagesize}MB`;
      FileSizeOverLimit.push(message);
    }
    if (audioFile.size > AUDIO_FILE_SIZE_LIMIT) {
      const message = `The selected audio is bigger than ${audiosize}MB`;

      FileSizeOverLimit.push(message);
    }
    if (FileSizeOverLimit.length > 0) {
      // Some Codes here

      return res.status(413).json({
        status: "file upload failed",
        message: {
          msg: 'File is over limit',
          FileSizeOverLimit
        }
      });
    }

    next();
  };
};
