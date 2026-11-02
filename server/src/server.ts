
import dotenv from "dotenv";
import app from "./app.js";
import connectDatabase from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 5050;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Kindora server running on port ${PORT}`);
  });
};

startServer();
