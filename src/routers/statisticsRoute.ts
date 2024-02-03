import express from "express"
const router = express.Router()

import {totalNumberofSongs} from "../controller/statisticsController"

router.get("/api/v1/totalSongs", totalNumberofSongs)

export default router