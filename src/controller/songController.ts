import { Request, Response } from "express";
import Song from "../models/songSchema";
import { fileUpload } from "../common/firebase/fileUpload";
import { Multer } from 'multer';

interface SongRequestBody {
  title: string;
  artist: string;
  album?: string;
  genre: string;
}

const createSong = async (formInput: SongRequestBody, imageUrl: string, audioUrl: string) => {
  const {title, artist, album, genre} = formInput
  try {
  const song = new Song({
    title: title,
    artist: artist,
    album: album,
    genre: genre,
    coverImageUrl: imageUrl,
    songDataUrl:  audioUrl
  });
  await song.save();
} catch(error) {
  console.log(error);
}
}
// Define a custom type for the files object

interface MulterFileObject {
  [fieldname: string]: Express.Multer.File[];
}

export const uploadSong = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("her");
  console.log(req.files)
  try {
    if (!req.body) {
      res.status(400).json({ error: "Request body is missing or empty" });
      return;
    }

    const files: any = req.files;
    if (!files || !files["image"] || !files["audio"]) {
      res.status(400).json({ error: "Image or audio file not provided" });
      return;
    }

    const imageFile = files["image"][0];
    const audioFile = files["audio"][0];
    const formInput = req.body;

    const uploadResult = await fileUpload(imageFile, audioFile);
    if (!uploadResult) {
      res.status(500).json({ error: "File upload failed" });
      return;
    }

    const { message, imageUrl, audioUrl } = uploadResult;
    await createSong(formInput, imageUrl, audioUrl);
    res.status(200).json({ status: "Song created Successfully", message });
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
    //console.log(deleteSong);
    
    res.status(200).json({ message: "song removed successfully", removedSong: deleteSong });
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

export const searchSongById = async (req: Request, res: Response) => {
  try {
    if (!req.params) {
      res
        .status(400)
        .json({ error: "Request parameter is missing or empty" });
      return;
    }
    const { id }: { id?: string } = req.params;
    const searchedSong = await Song.findById(id);
    if (!searchedSong) {
      res.status(404).json({ message: "Song not found" });
      return;
    }
    res.status(200).json({ message: "Song found", song: searchedSong });
  } catch (error) {
    console.error("Error while trying to find songs by genre:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
