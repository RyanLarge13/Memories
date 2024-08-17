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
let storage;

if (mode === "dev") {
  storage = new Storage({
    keyFilename: path.join(process.cwd(), credentials),
  });
}
if (mode === "prod") {
  const parsedCredentials = JSON.parse(credentials);
  if (!parsedCredentials) {
    throw new Error(
      "We could not parse the environment variables to connect to google storage bucket"
    );
  }
  storage = new Storage({
    credentials: parsedCredentials,
  });
}

if (!storage) {
  throw new Error(
    "We could not initialize your storage bucket with the given credentials"
  );
}

const bucketName = "memory-images-bucket";
const bucket = storage.bucket(bucketName);

export { bucket };
