const express = require("express");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

router.post(
  "/",
  authMiddleware,
  isAdmin,
  upload.array("images", 10),
  (req, res) => {
    const urls = req.files.map((file) => file.path);
    res.json({ urls });
  }
);

router.delete("/delete-img/:id", authMiddleware, isAdmin, async (req, res) => {
  try {
    const public_id = req.params.id;
    await cloudinary.uploader.destroy(public_id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
