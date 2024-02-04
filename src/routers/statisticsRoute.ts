import express from "express";
const router = express.Router();

import {
  totalNumberofSongs,
  totalNumberofArtists,
  totalNumberofAlbums,
  totalNumberofGenre,
  //
  numberOfSongsByGenre,
  numberOfSongsAndAlbumsByArtist,
  numberOfSongsPerAlbum
} from "../controller/statisticsController";

router.get("/api/v1/totalSongs", totalNumberofSongs);
router.get("/api/v1/totalArtists", totalNumberofArtists);
router.get("/api/v1/totalAlbums", totalNumberofAlbums);
router.get("/api/v1/totalGenre", totalNumberofGenre);
//
router.get("/api/v1/songsPerGenre", numberOfSongsByGenre);
router.get("/api/v1/songsAndAlbumsPerArtist", numberOfSongsAndAlbumsByArtist);
router.get("/api/v1/songsPerAlbum", numberOfSongsPerAlbum)
export default router;
