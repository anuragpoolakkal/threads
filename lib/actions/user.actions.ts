"use server";

interface Params {
	userId: string;
	username: string;
	name: string;
	bio: string;
	image: string;
	path: string;
}

export async function updateUser({ userId, bio, name, path, username, image }: Params) {}
