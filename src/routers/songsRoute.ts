import express from "express";
const router = express.Router();

import { upload } from "../middleware/fileOperation";

import { fileExtLimiter } from "../middleware/fileExtLimiter";
import { fileSizeLimiter } from "../middleware/fileSizeLimiter";

import {
  uploadSong,
  listSongs,
  updateSong,
  removeSong,
  songsByGenre,
  searchSongById,
} from "../controller/songController";

router.post(
  "/api/v1/uploadSong",
  upload.fields([{ name: "image" }, { name: "audio" }]),
  fileExtLimiter([".mp3", ".png", ".jpeg", ".jpg"]),
  // for image & audio in MB.
  fileSizeLimiter(3, 10),
  uploadSong
);
router.get("/api/v1/listSongs", listSongs);
router.get("/api/v1/genre/:genre", songsByGenre);
router.put(
  "/api/v1/updateSong",
  upload.fields([{ name: "image" }, { name: "audio" }]),
  fileExtLimiter([".mp3", ".png", ".jpeg", ".jpg"]),
  fileSizeLimiter(3, 10),
  updateSong
);
router.delete("/api/v1/removeSong", removeSong);
router.get("/api/v1/searchSong/:id", searchSongById);

export default router;
