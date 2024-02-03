import { Request, Response } from "express";
import Song from "../models/songSchema";

export const totalNumberofSongs = async (req: Request, res: Response) => {
    try {
        const totalCounts = await Song.aggregate([
          { $group: { _id: null, totalSongs: { $sum: 1 }, totalArtists: { $addToSet: '$artist' }, totalAlbums: { $addToSet: '$album' }, totalGenres: { $addToSet: '$genre' } } }
        ]);
    
        res.status(200).json({ totalSongs: totalCounts });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
export const totalNumberofArtists = async (req: Request, res: Response) => {}
export const totalNumberofAlbums = async (req: Request, res: Response) => {}
export const totalNumberofGenre = async (req: Request, res: Response) => {}

//
const numberOfSongsByGenre = async (req: Request, res: Response) => {}
const numberOfSongsAndAlbumsByArtist = async (req: Request, res: Response) => {}
const numberOfSongsPerAlbum = async (req: Request, res: Response) => {}