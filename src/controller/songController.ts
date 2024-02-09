import { Request, Response } from "express";
import Song from "../models/songSchema";

interface SongRequestBody {
  title: string;
  artist: string;
  album?: string;
  genre: string;
  coverImageUrl: string;
}

export const createSong = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body) {
      res.status(400).json({ error: "Request body is missing or empty" });
      return;
    }

    const { title, artist, album, genre, coverImageUrl }: SongRequestBody =
      req.body;
    const song = new Song({
      title: title,
      artist: artist,
      album: album,
      genre: genre,
      coverImageUrl: coverImageUrl,
    });

    await song.save();

    res.status(200).json({ message: "Song created Successfully" });
    return;
  } catch (error) {
    console.error("Error creating song:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const listSongs = async (req: Request, res: Response): Promise<void> => {
  try {
    const songs = await Song.find({}).exec();
    res.status(200).json({ message: "Songs found", songs: songs });
    return;
  } catch (error) {
    console.error("Error while fetching songs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateSong = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body) {
      res.status(400).json({ error: "Request body is missing or empty" });
      return;
    }

    const {
      songid,
      title,
      artist,
      album,
      genre,
      coverImageUrl,
    }: { songid: string } & SongRequestBody = req.body;
    const song = await Song.where("_id").equals(songid).exec();
    if (song.length < 1) {
      res.status(404).json({
        message: "Can't update the song because the song is not found",
      });
      return;
    }
    song[0].title = title;
    song[0].artist = artist;
    song[0].album = album;
    song[0].genre = genre;
    song[0].coverImageUrl = coverImageUrl;

    await song[0].save();
    res.status(200).json({ message: "Song updated Successfully" });
    return;
  } catch (error) {
    console.error("Error while updating the songs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const removeSong = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.query) {
      res
        .status(400)
        .json({ error: "Request query parameter is missing or empty" });
      return;
    }
    const { songid }: { songid?: string } = req.query;
    const deleteSong = await Song.findOneAndDelete({ _id: songid }).exec();
    if (!deleteSong) {
      res.status(404).json({ message: "Song not found" });
      return;
    }
    res.status(200).json({ message: "song removed successfully" });
    return;
  } catch (error) {
    console.error("Error while trying to remove the song:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const songsByGenre = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.params) {
      res
        .status(400)
        .json({ error: "Request parameter parameter is missing or empty" });
      return;
    }
    const { genre }: { genre?: string } = req.params;

    const songsByGenre = await Song.find({ genre: genre }).exec();
    if (songsByGenre.length === 0) {
      res.status(404).json({ message: "Song not found" });
      return;
    }
    res.status(200).json({ message: "Songs found", songs: songsByGenre });
    return;
  } catch (error) {
    console.error("Error while trying to find songs by genre:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
