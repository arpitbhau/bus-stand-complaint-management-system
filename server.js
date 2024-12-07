// Jai Shree Ram

import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import nodemailer from "nodemailer";

const sendEmail = async ({email, complaintId}) => {
  
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'davin.strosin@ethereal.email',
            pass: 'fPPHncbhe1KRJ4yqUw'
        }
    });
      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Bus stand Complaint System    " <busstand@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Complaint Submission Confirmation", // Subject line
          text: `Thank You for your Submission\n\n\nYour Complaint ID: ${complaintId}`, // plain text body
          html: `<b>Thank You for your Submission\n\n\nYour Complaint ID: ${complaintId}</b>`, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        console.log(email);
        
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      
      main().catch(console.error);
      



};

const app = express();

// dotenv config
dotenv.config();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Use the filename from request
    cb(null, req.uploadFilename + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from public folder

app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post(
  "/complaint",
  (req, res, next) => {
    // Generate filename before upload
    const randomString = crypto.randomBytes(16).toString("hex");
    req.uploadFilename = randomString;
    next();
  },
  upload.fields([
    { name: "complaintPhoto", maxCount: 1 },
    { name: "cameraPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      //file uplaod
      const files = req.files;
      const formData = req.body;


      // Handle the uploaded files and form data here
      res.json({
        message: "Complaint submitted successfully",
        complaintId: req.uploadFilename,
        filename: req.uploadFilename,
        files: files,
        formData: formData,
      });



    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
