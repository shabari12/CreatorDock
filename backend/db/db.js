const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    const dbUri = process.env.MONGO_URI;
    if (!dbUri) {
      throw new Error("Database URI is not defined in environment variables.");
    }
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1); // Exit the process if the database connection fails
  }
};

module.exports = connectToDB;
