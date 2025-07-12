const router = require("express").Router();
const { createUser, loginUser, getAllUsers, findUserById, updateUser, deleteUser } = require("../controllers/userController");
const authGuard = require("../middleware/authguard");
const isAdmin = require("../middleware/isAdmin");

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", authGuard, isAdmin, getAllUsers);
router.get("/:id", authGuard, findUserById);
router.put("/:id", authGuard, updateUser);
router.delete("/:id", authGuard, deleteUser);

module.exports = router;