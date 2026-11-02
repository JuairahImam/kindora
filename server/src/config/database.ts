
import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

const connectDatabase = async (): Promise<typeof mongoose> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  // Reuse an existing connection
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Reset a stale connection promise after disconnection
  if (mongoose.connection.readyState === 0) {
    connectionPromise = null;
  }

  // Reuse an ongoing connection attempt
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoUri)
      .then((connection) => {
        console.log(
          `MongoDB connected: ${connection.connection.host}`
        );

        return connection;
      })
      .catch((error: unknown) => {
        connectionPromise = null;
        throw error;
      });
  }

  return connectionPromise;
};

export default connectDatabase;
