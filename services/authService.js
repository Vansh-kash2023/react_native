import { account, database } from "./../appwriteConfig";

export const signup = async (email, password, name, emergencyContact) => {
    try {
        // Create new user account
        const newUser = await account.create("unique()", email, password, name);

        // Store user details in the database
        await database.createDocument(
            "67a9008c0030d03e51bb", // Database ID
            "67a9009e00363ce41072", // Collection ID
            newUser.$id,
            {
                email,
                name,
                emergencyContact: emergencyContact?.trim() ? emergencyContact : null, // Store null if empty
                createdAt: new Date().toISOString(),
            }
        );

        return newUser;
    } catch (error) {
        console.error("Signup Error:", error); // Log for debugging
        throw new Error(error.message || "Signup failed. Please try again.");
    }
};

export const login = async (email, password) => {
    try {
        return await account.createEmailPasswordSession(email, password);
    } catch (error) {
        console.error("Login Error:", error);
        throw new Error(error.message || "Login failed. Check your credentials.");
    }
};

export const getUser = async () => {
    try {
        return await account.get();
    } catch (error) {
        console.error("Get User Error:", error);
        return null; // Return null if no user is logged in
    }
};

export const logout = async () => {
    try {
        return await account.deleteSession("current");
    } catch (error) {
        console.error("Logout Error:", error);
        throw new Error("Logout failed. Please try again.");
    }
};

// Send password reset email
export const sendPasswordResetEmail = async (email) => {
    try {
        await account.createRecovery(email, "https://yourapp.com/reset-password");
        return "Password reset email sent!";
    } catch (error) {
        throw error;
    }
};

// Reset password using link
export const resetPassword = async (userId, secret, newPassword) => {
    try {
        await account.updateRecovery(userId, secret, newPassword, newPassword);
        return "Password reset successful!";
    } catch (error) {
        throw error;
    }
};
