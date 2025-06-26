const router = require("express").Router();
const { createUser, loginUser, getAllUsers, findUserById, updateUser, deleteUser } = require("../controllers/userController");
const authGuard = require("../middleware/authguard");

const isAdmin = require("../middleware/isAdmin");
const fileUpload = require("../middleware/multer");

router.post("/register", fileUpload("image"), createUser);
router.post("/login", loginUser);
router.get("/", authGuard, isAdmin, getAllUsers);
router.get("/:id", findUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;