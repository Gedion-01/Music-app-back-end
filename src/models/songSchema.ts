import mongoose, {Model, Schema, model} from "mongoose";

interface Song {
    title: string;
    artist: string;
    album?: string;
    genre: string;
    coverImageUrl: string;
    createdAt: Date;
    updatedAt: Date;
    songDataUrl: string 
}

const SongSchema: Schema<Song> = new mongoose.Schema({
   title: {type: String, required: true},
   artist: {type: String, required: true},
   album: String,
   genre: {type: String, required: true},
   coverImageUrl: {type: String, required: true},
   createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now()
   },
   updatedAt: {
    type: Date,
    default: () => Date.now()
   },
   songDataUrl: {type: String, required: true}
})
SongSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Song = mongoose.model('Songs', SongSchema)

export default Song