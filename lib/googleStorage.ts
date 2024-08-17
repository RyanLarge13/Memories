import { Storage } from "@google-cloud/storage";
import path from "path";

const mode = process.env.PROD;
if (!mode) {
  throw new Error("Cannot access production variable");
}

let credentials;
if (mode === "dev") {
  credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
}
if (mode === "prod") {
  credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
}
if (!credentials) {
  throw new Error("Could not access storage bucket credentials");
}

const storage = new Storage({
  keyFilename: path.join(process.cwd(), credentials),
});

const bucketName = "memory-images-bucket";
const bucket = storage.bucket(bucketName);

export { bucket };
