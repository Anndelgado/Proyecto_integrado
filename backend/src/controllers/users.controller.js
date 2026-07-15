import {getAllUsers} from "../services/users.service.js";

export const getUsers = async (req, res) =>
{
    const user = await getAllUsers();
    res.json(user);
};

export const getUserById = async (req, res) => 
{};

export const createUser = async (req, res) => 
{};

export const updateUser = async (req, res) =>
{};

export const deleteUser = async (req, res) =>
{} 