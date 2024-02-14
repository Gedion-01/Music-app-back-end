import path from "path";
import { Request, Response, NextFunction } from "express";

export const fileExtLimiter = (allowedExtArray: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files: any = req.files;
    const imageFile: any = files["image"] ? files["image"][0] : null;
    const audioFile: any = files["audio"] ? files["audio"][0] : null;
    const invalidFileExtensions = [];

    const Imgext: string = path.extname(imageFile.originalname); // extension of file.
    const Songext: string = path.extname(audioFile.originalname); // extension of file.

    console.log(Imgext, Songext);
    
    // if the image extension is not included push it
    if (!allowedExtArray.includes(Imgext)) {
      invalidFileExtensions.push(
        `You can't upload ${imageFile.originalname} because this kind of file is not valid Image file.`
      );
    }
    // if the audio extension is not included push it
    if (!allowedExtArray.includes(Songext)) {
      invalidFileExtensions.push(
        `You can't upload ${audioFile.originalname} because this kind of file is not valid audio file.`
      );
    }

    if (invalidFileExtensions.length > 0) {
      return res.status(422).json({
        status: "file upload failed",
        message: {
          msg: "Invalid extensions included",
          invalid_extensions: invalidFileExtensions,
        },
      });
    }
    next();
  };
};
