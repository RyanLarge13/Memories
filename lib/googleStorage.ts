import { Storage } from "@google-cloud/storage";
import path from "path";

const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credentials) {
  throw new Error("Could not access storage bucket credentials");
}

const storage = new Storage({
  keyFilename: path.join(process.cwd(), credentials),
});

const bucketName = "memory-images-bucket";
const bucket = storage.bucket(bucketName);

export { bucket };
