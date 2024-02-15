import { getStorage, ref, deleteObject } from "firebase/storage";
import { firebaseConfig } from "../config/firebase.config";
import { initializeApp } from "firebase/app";

// Initialize Firebase app and storage
initializeApp(firebaseConfig);
const storage = getStorage();

export const deleteFileFromStorageByUrl = async(audioUrl: string, imageUrl: string) => {
    try {
        // Create a reference to the file based on the URL
        const audioRef = ref(storage, audioUrl);
        const imageRef = ref(storage, imageUrl);

        // Delete the file
        await deleteObject(audioRef);
        await deleteObject(imageRef)

        console.log('File successfully deleted!');
    } catch (error) {
        console.error('Error deleting file: ', error);
    }
}
