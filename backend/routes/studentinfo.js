const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// Route to fetch student details by email
router.get("/:email", async (req, res) => {
  const { email } = req.params;
  const escapedEmail = email.replace(/\./g, "\\."); // Escape dots in email

  try {
    console.log(`Fetching profile for email: ${email}`); // Correct debug log

    // Corrected regular expression syntax for email matching
    const student = await Student.findOne({ email: new RegExp(`^${escapedEmail}$`, "i") });

    if (!student) {
      console.log("Student not found in database"); // Debug log
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student); // Send student details as response
  } catch (err) {
    console.error("Error fetching student details:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to update student profile image
router.put("/:email/update-image", async (req, res) => {
  const { email } = req.params;
  const { image } = req.body; // New image for the student

  try {
    // Corrected regular expression syntax for email matching
    const student = await Student.findOneAndUpdate(
      { email: new RegExp(`^${email}$`, "i") },
      { image },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Image updated successfully", student });
  } catch (err) {
    console.error("Error updating image:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

