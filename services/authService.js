import { account, database } from "./../appwriteConfig";

export const signup = async (email, password, name) => {
    try {
        const newUser = await account.create("unique()", email, password, name);
        await database.createDocument(
            "67a9008c0030d03e51bb",
            "67a9009e00363ce41072",
            newUser.$id,
            {
                email,
                name,
                createdAt: new Date().toISOString(),
            }
        );
        return newUser;
    } catch (error) {
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        return await account.createEmailPasswordSession(email, password);
    } catch (error) {
        throw error;
    }
};

export const getUser = async () => {
    try {
        return await account.get();
    } catch (error) {
        return null;
    }
};

export const logout = async () => {
    try {
        return await account.deleteSession("current");
    } catch (error) {
        throw error;
    }
};
