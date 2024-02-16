import { Request, Response } from "express";
import Song from "../models/songSchema";
import { fileUpload } from "../common/firebase/fileUpload";
import { deleteFileFromStorageByUrl } from "../common/firebase/deleteFileFormStorageByUrl";

interface SongRequestBody {
  title: string;
  artist: string;
  album?: string;
  genre: string;
  [key: string]: string | undefined;
}

const createSong = async (
  formInput: SongRequestBody,
  imageUrl: string,
  audioUrl: string
) => {
  const { title, artist, album, genre } = formInput;
  console.log(formInput);
  try {
    const song = new Song({
      title: title,
      artist: artist,
      album: album,
      genre: genre,
      coverImageUrl: imageUrl,
      songDataUrl: audioUrl,
    });
    await song.save();
    return song;
  } catch (error) {
    console.log(error);
  }
};

export const uploadSong = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.body) {
      res.status(400).json({ error: "Request body is missing or empty" });
      return;
    }
    console.log(req.body);

    const files: any = req.files;
    if (!files || !files["image"] || !files["audio"]) {
      res.status(400).json({ error: "Image or audio file not provided" });
      return;
    }

    const imageFile = files["image"][0];
    const audioFile = files["audio"][0];
    const formInput: SongRequestBody = req.body;
    // check if every element in the body has value
    const allValuesPresent = Object.keys(formInput).every((key) => {
      const value = formInput[key];
      return value !== null && value !== undefined && value !== "";
    });
    if (!allValuesPresent) {
      res
        .status(400)
        .json({ message: "Some properties in req.body are missing values." });
      return;
    }

    const uploadResult = await fileUpload(imageFile, audioFile);
    if (!uploadResult) {
      res.status(500).json({ error: "File upload failed" });
      return;
    }

    const { message, imageUrl, audioUrl } = uploadResult;
    const createdSong = await createSong(formInput, imageUrl, audioUrl);

    res
      .status(200)
      .json({ status: "Song created Successfully", message, createdSong });
    return;
  } catch (error) {
    console.error("Error creating song:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return;
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
    return;
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
    // my files
    const files: any = req.files;
    if (!files || !files["image"] || !files["audio"]) {
      res.status(400).json({ error: "Image or audio file not provided" });
      return;
    }
    const imageFile = files["image"][0];
    const audioFile = files["audio"][0];

    // body
    const formInput: SongRequestBody & {
      songid: string;
      coverImageUrl: string;
      songDataUrl: string;
    } = req.body;
    // check if every element in the body has value
    const allValuesPresent = Object.keys(formInput).every((key) => {
      const value = formInput[key];
      return value !== null && value !== undefined && value !== "";
    });
    if (!allValuesPresent) {
      res
        .status(400)
        .json({ message: "Some properties in req.body are missing values." });
      return;
    }

    // const {
    //   songid,
    //   title,
    //   artist,
    //   album,
    //   genre,
    // }: { songid: string, coverImageUrl: string, songDataUrl: string  } & SongRequestBody = req.body;

    const song = await Song.where("_id").equals(formInput.songid);
    // if there is no value break, and return
    if (song.length < 1) {
      res.status(404).json({
        message: "Can't update the song because the song is not found",
      });
      return;
    }
    // if we have value, then get the previous file url and then remove the file from the storage.
    if (song.length > 0) {
      const imageFileUlr = song[0].coverImageUrl;
      const audioFileUrl = song[0].songDataUrl;
      console.log(imageFileUlr, audioFileUrl);
      deleteFileFromStorageByUrl(audioFileUrl, imageFileUlr);
    }
    const uploadResult = await fileUpload(imageFile, audioFile);
    if (!uploadResult) {
      res.status(500).json({ message: "File upload failed" });
      return;
    }
    // destruct the uploaded data returned values
    const { message, imageUrl, audioUrl } = uploadResult;
    // set the new values
    song[0].title = formInput.title;
    song[0].artist = formInput.artist;
    song[0].album = formInput.album;
    song[0].genre = formInput.genre;
    song[0].coverImageUrl = imageUrl
    song[0].songDataUrl = audioUrl

    await song[0].save();
    res.status(200).json({ message: "Song updated Successfully" });
    return;
  } catch (error) {
    console.error("Error while updating the songs:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return
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
    const searchdeletedSong = await Song.findById(songid);

    if (searchdeletedSong) {
      const imageFileUlr = searchdeletedSong.coverImageUrl;
      const audioFileUrl = searchdeletedSong.songDataUrl;
      console.log(imageFileUlr, audioFileUrl);
      deleteFileFromStorageByUrl(audioFileUrl, imageFileUlr);
    }
    const deleteSong = await Song.findOneAndDelete({ _id: songid });
    if (!deleteSong) {
      res.status(404).json({ message: "Song not found" });
      return;
    }
    //console.log(deleteSong);

    res
      .status(200)
      .json({ message: "song removed successfully", removedSong: deleteSong });
    return;
  } catch (error) {
    console.error("Error while trying to remove the song:", error);
    res.status(500).json({ error: "Internal Server Error" });
    return
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
    return
  }
};

export const searchSongById = async (req: Request, res: Response) => {
  try {
    if (!req.params) {
      res.status(400).json({ error: "Request parameter is missing or empty" });
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
    return
  }
};
