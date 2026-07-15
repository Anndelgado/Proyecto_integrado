import {Router} from "express";
import {getUsers} from "../controllers/users.controller.js";

const router = Router();

router.get("/",getUsers);

// router.get("/:id", getUserById);

// router.post("/", createUser);

// router.delete("/:id", deleteUser);

export default router;