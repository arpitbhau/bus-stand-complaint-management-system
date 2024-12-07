// Jai Shree Ram

import express from "express";
import dotenv from "dotenv";

const app = express();

// dotenv config
dotenv.config();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from public folder

app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index");
});
app.post("/complaint", (req, res) => {
    try {
      // Generate a unique complaint ID
      const complaintId = Math.random().toString(36).substring(2, 10);

      // Handle the uploaded files and form data here
      res.json({
        message: "Complaint submitted successfully",
        complaintId: complaintId
      });

    } catch (error) {
      res.status(400).json({
        error: error.message
      });
    }
  }
);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
