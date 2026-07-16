import {getAllUsers} from "../services/users.service.js";

export const getUsers = async (req, res) =>{
    const user = await getAllUsers();
    if(user){
        res.status(200).json({
            Success: true,
            message: "Users found",
            data: user

        })
    }else{
        res.status(404).json({
            Success: false,
            message: "Users not found"
    })}
};

export const getUserById = async (req, res) => 
{};

export const createUser = async (req, res) => 
{};

export const updateUser = async (req, res) =>
{};

export const deleteUser = async (req, res) =>
{} 