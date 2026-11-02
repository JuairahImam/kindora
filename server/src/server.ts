
import "dotenv/config";

import app from "./app.js";
import connectDatabase from "./config/database.js";

const PORT = process.env.PORT || 5050;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Kindora server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Kindora server:", error);
    process.exitCode = 1;
  }
};

startServer();
