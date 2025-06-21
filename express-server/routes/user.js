const { createUser, loginUser, getAllUsers, findUserById, updateUser, deleteUser } = require("../controllers/userController");

const router = require("express").Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/:id", findUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;