const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dgx5gdx7k',  // Set in .env
  api_key: '551457272212954', // Set in .env
  api_secret: 'CsYSTVQfoTNvnUTzWMDTzCSdpac',
});

// Log Cloudinary configuration to confirm it's correctly loaded
console.log("Cloudinary configured with cloud name:", cloudinary.config().cloud_name);

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "college-blog", // Folder in Cloudinary
    resource_type: "auto",  // Automatically detects file type
  },
});




// Log storage configuration to confirm setup
console.log("Multer Cloudinary storage configured with folder:", storage.params.folder);

// Initialize multer with Cloudinary storage
const upload = multer({ storage });

// Log multer setup confirmation
console.log("Multer upload initialized with Cloudinary storage.");

// Export the Cloudinary instance and upload middleware for use in routes
module.exports = { cloudinary, upload };

