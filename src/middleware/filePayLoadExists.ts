import { Request, Response, NextFunction } from "express";


// Middleware function
export const filesPayloadExists = (req: Request, res: Response, next: NextFunction) => {
    const files: any = req.files;

    const imageFile = files['image'] ? files['image'][0] : null;
    const audioFile = files['audio'] ? files['audio'][0] : null;

    if (!imageFile || !audioFile) {
        return res.status(400).json({ status: "error", message: "Both image and audio files are required" });
    }

    next();
};
