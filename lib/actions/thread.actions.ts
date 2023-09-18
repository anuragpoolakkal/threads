"use server";

import { revalidatePath } from "next/cache";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
}

export async function createThread({ text, author, communityId, path }: Params) {
	try {
		connectToDB();

		const communityIdObject = await Community.findOne({ id: communityId }, { _id: 1 });

		const createdThread = await Thread.create({
			text,
			author,
			community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
		});

		// update User model
		await User.findByIdAndUpdate(author, {
			$push: { threads: createdThread._id },
		});

		if (communityIdObject) {
			// update Community model
			await Community.findByIdAndUpdate(communityIdObject, {
				$push: { threads: createdThread._id },
			});
		}

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to create thread: ${error.message}`);
	}
}
