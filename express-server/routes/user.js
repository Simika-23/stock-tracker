const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { createUser, loginUser, getAllUsers, findUserById, updateUser, deleteUser } = require("../controllers/userController");
const authGuard = require("../middleware/authguard");
const isAdmin = require("../middleware/isAdmin");

// Rate limiter for login and register to prevent abuse
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: "Too many attempts, please try again after 10 minutes." },
});

router.post("/register", authLimiter, createUser);
router.post("/login", authLimiter, loginUser);
router.get("/", authGuard, isAdmin, getAllUsers);
router.get("/:id", authGuard, findUserById);
router.put("/:id", authGuard, updateUser);
router.delete("/:id", authGuard, deleteUser);

module.exports = router;