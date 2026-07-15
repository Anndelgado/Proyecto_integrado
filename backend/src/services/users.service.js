
export const getAllUsers = async () => {
    return [
        {id: 1, name: "John Doe", email: "john.doe@example.com"},
        {id: 2, name: "Jane Smith", email: "jane.smith@example.com"}
    ];
};

export const getUserByIdService = async (id) => {};

export const createUserService = async (user) => {};

export const updateUserService = async (id, user) => {};

export const deleteUserService = async (id) => {};