import {Router} from "express";

const router = Router();

router.get("/",(req, res) =>{
    res.json({message: "Obteniendo todos los usuarios"});
});

export default router;