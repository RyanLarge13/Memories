// lib/googleStorage.js
import { Storage } from "@google-cloud/storage";
import path from "path";

const storage = new Storage({
  keyFilename: path.join(
    process.cwd(),
    process.env.GOOGLE_APPLICATION_CREDENTIALS
  ),
});

const bucketName = "memory-images-bucket";
const bucket = storage.bucket(bucketName);

export { bucket };
