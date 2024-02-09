import express from "express"
const router = express.Router()

import {createSong, listSongs, updateSong, removeSong, songsByGenre} from "../controller/songController"
console.log('sdsd')
router.post("/api/v1/createSong", createSong)
router.get("/api/v1/listSongs", listSongs)
router.get("/api/v1/genre/:genre", songsByGenre)
router.put("/api/v1/updateSong", updateSong)
router.delete("/api/v1/removeSong", removeSong)

export default router