import { initializeApp } from "firebase/app";

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

import { firebaseConfig } from "../config/firebase.config";

initializeApp(firebaseConfig);

const storage = getStorage();

export const fileUpload = async (imageFile: any, audioFile: any) => {
  console.log(imageFile, audioFile)
  try {
    const imageStorageRef = ref(storage, `images/${imageFile.originalname}`);
    const imageMetaData = {
      contentType: imageFile.mimetype,
    };
    console.log(imageMetaData)
    const imageSnapShot = await uploadBytesResumable(
      imageStorageRef,
      imageFile.buffer,
      imageMetaData
    );
    const imageDownloadUrl = await getDownloadURL(imageSnapShot.ref);

    // now upload audio
    const audioStorageRef = ref(storage, `musics/${audioFile.originalname}`);
    const audioMetaData = {
      contentType: audioFile.mimetype,
    };
    console.log(audioMetaData)
    const audioSnapShot = await uploadBytesResumable(
      audioStorageRef,
      audioFile.buffer,
      audioMetaData
    );
    const audioDownloadUrl = await getDownloadURL(audioSnapShot.ref);
    return {
      message: `${audioFile.originalname} and ${imageFile.originalname} are uploaded successfully`,
      imageUrl: imageDownloadUrl,
      audioUrl: audioDownloadUrl,
    };
  } catch (error) {
    console.log(error)
  }
};
