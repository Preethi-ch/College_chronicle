const express = require("express");
const Post = require("../models/uploads"); // Ensure correct model import

const router = express.Router();

// Fetch posts with optional filtering by category and subcategory
router.get("/", async (req, res) => {
  try {
    const { category, subCategory } = req.query; // Extract query parameters

    // Build the query dynamically
    const query = { status: "posted" }; // Only fetch posts with status "posted"
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;

    // Fetch posts from the database (sorted by newest first)
    const posts = await Post.find(query).sort({ createdAt: -1 });
    res.json(posts); // Send sorted posts to the client
  } catch (error) {
    console.error("Error fetching posts:", error); // Log error for debugging
    res.status(500).json({ error: "Server Error" }); // Handle errors gracefully
  }
});

module.exports = router;
