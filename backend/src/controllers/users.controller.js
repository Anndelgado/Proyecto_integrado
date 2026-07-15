import {getAllUsers} from "../services/users.service.js";

export const getUsers = (req,res) => {

    const users = getAllUsers();
    res.json(users);
};

// export const getUserById = (req,res) => {
//     const user = getUserByIdService();
//     res.json(user)
// }