const express = require("express");
const Post = require("../models/uploads");

const router = express.Router();

/**
 * GET /api/posts
 * Fetch all posts with status "posted", sorted by newest first
 */
router.get("/", async (req, res) => {
  try {
    console.log("➡️ [GET] Fetching all posted items...");

    const posts = await Post.find({ status: "posted" }).sort({ createdAt: -1 });

    console.log(`✅ ${posts.length} posts fetched.`);

    return res.status(200).json({
      message: "Posts fetched successfully.",
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("❌ Error fetching posts:", error.message);
    return res.status(500).json({
      message: "Failed to fetch posts.",
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/posts/subcategory?category=...&subcategory=...
 * Fetch posts filtered by category and/or subcategory
 */
router.get("/subcategory", async (req, res) => {
  const { category, subcategory } = req.query;

  try {
    console.log("➡️ [GET] Fetching filtered posts...");
    console.log("📂 Category:", category || "none");
    console.log("📁 Subcategory:", subcategory || "none");

    const query = { status: "posted" };

    if (category) {
      query.category = new RegExp(`^${category}$`, "i"); // case-insensitive exact match
    }
    if (subcategory) {
      query.subCategory = new RegExp(`^${subcategory}$`, "i");
    }

    console.log("🔍 Query:", query);

    const posts = await Post.find(query).sort({ createdAt: -1 });

    console.log(`✅ ${posts.length} filtered posts fetched.`);

    return res.status(200).json({
      message: posts.length
        ? "Filtered posts fetched successfully."
        : "No posts found for the specified category/subcategory.",
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("❌ Error fetching filtered posts:", error.message);
    return res.status(500).json({
      message: "Failed to fetch filtered posts.",
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
