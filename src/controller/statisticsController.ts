import { Request, Response } from "express";
import Song from "../models/songSchema";

export const totalNumberofSongs = async (req: Request, res: Response) => {
  try {
    const totalCounts = await Song.aggregate([
      {
        $group: {
          _id: null,
          totalSongs: { $sum: 1 },
          totalArtists: { $addToSet: "$artist" },
          totalAlbums: { $addToSet: "$album" },
          totalGenres: { $addToSet: "$genre" },
        },
      },
    ]);

    res.status(200).json({ message: "Total Songs", totalSongs: totalCounts });
    return
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const totalNumberofArtists = async (req: Request, res: Response) => {
  try {
    const totalArtistsResult = await Song.aggregate([
      {
        $group: {
          _id: null,
          uniqueArtists: { $addToSet: "$artist" },
        },
      },
      {
        $unwind: "$uniqueArtists",
      },
      {
        $group: {
          _id: null,
          totalArtists: { $sum: 1 },
          uniqueArtists: { $addToSet: "$uniqueArtists" },
        },
      },
    ]);

    const totalArtistsCount =
      totalArtistsResult.length > 0 ? totalArtistsResult[0].totalArtists : 0;
    const uniqueArtists =
      totalArtistsResult.length > 0 ? totalArtistsResult[0].uniqueArtists : [];

    res.status(200).json({ message: 'Total Artists', data: { totalArtistsCount, uniqueArtists } });
    return
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const totalNumberofAlbums = async (req: Request, res: Response) => {
  try {
    const totalAlbums = await Song.aggregate([
      {
        $match: {
          album: { $ne: "" } // Exclude documents with empty string albums
        }
      },
      {
        $group: {
          _id: null,
          uniqueAlbums: { $addToSet: "$album" },
        },
      },
      {
        $unwind: "$uniqueAlbums",
      },
      {
        $group: {
          _id: null,
          totalAlbums: { $sum: 1 },
          uniqueAlbums: { $addToSet: "$uniqueAlbums" },
        },
      },
    ]);

    const totalAlbumsCount =
      totalAlbums.length > 0 ? totalAlbums[0].totalAlbums : 0;
    const uniqueAlbums =
      totalAlbums.length > 0 ? totalAlbums[0].uniqueAlbums : [];

    res.status(200).json({ message: 'Total Albums', data: { totalAlbumsCount, uniqueAlbums } });
    return
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const totalNumberofGenre = async (req: Request, res: Response) => {
  try {
    const totalGenres = await Song.aggregate([
      {
        $group: {
          _id: null,
          uniqueGenres: { $addToSet: "$genre" },
        },
      },
      {
        $unwind: "$uniqueGenres",
      },
      {
        $group: {
          _id: null,
          totalGenres: { $sum: 1 },
          uniqueGenres: { $addToSet: "$uniqueGenres" },
        },
      },
    ]);

    const totalGenreCount = totalGenres.length > 0 ? totalGenres[0].totalGenres : 0
    const uniqueGenres = totalGenres.length > 0 ? totalGenres[0].uniqueGenres : 0

    res.status(200).json({ message: 'Total Genres', data: { totalGenreCount, uniqueGenres } });
    return
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//
export const numberOfSongsByGenre = async (req: Request, res: Response) => {
  try {
    const genreCounts = await Song.aggregate([
      { $group: { _id: '$genre', count: { $sum: 1 } } }
    ]);

    res.status(200).json({ genreCounts });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const numberOfSongsAndAlbumsByArtist = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await Song.aggregate([
      {
        $group: {
          _id: '$artist',
          totalSongs: { $sum: 1 },
          totalAlbums: {
            $sum: { $cond: [{ $eq: ['$album', ""] }, 0, 1] }
          },
          albums: { 
            $addToSet: {
              $cond: [{ $eq: ['$album', ''] }, null, '$album']
            } 
          },
          songs: { $push: { title: '$title', genre: '$genre' } }
        }
      },
      {
        $project: {
          _id: 0,
          artist: '$_id',
          totalSongs: 1,
          albums: 1,
          songs: 1
        }
      }
    ]);

    res.status(200).json({ artistCountsAndAlbums: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};
export const numberOfSongsPerAlbum = async (req: Request, res: Response) => {
  try {
    const result = await Song.aggregate([
      {
        $match: {
          album: { $ne: "" } // Exclude documents with empty string albums
        }
      },
      {
        $group: {
          _id: '$album',
          count: { $sum: 1 },
          songs: { $push: { title: '$title', artist: '$artist', genre: '$genre' } }
        }
      },
      {
        $project: {
          _id: 0,
          album: '$_id',
          count: 1,
          songs: 1
        }
      }
    ]);

    res.status(200).json({ albumCountsAndSongs: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
