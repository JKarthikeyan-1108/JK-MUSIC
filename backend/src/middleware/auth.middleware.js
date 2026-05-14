import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	if (!req.auth.userId) {
		return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	}
	next();
};

export const requireAdmin = async (req, res, next) => {
	try {
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		const userEmail = currentUser.primaryEmailAddress?.emailAddress;
		const isAdmin = process.env.ADMIN_EMAIL === userEmail;

		if (!isAdmin) {
			console.log(`Admin check failed: logged in as "${userEmail}", but ADMIN_EMAIL is "${process.env.ADMIN_EMAIL}"`);
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		next();
	} catch (error) {
		console.log("Error in requireAdmin middleware:", error);
		next(error);
	}
};
