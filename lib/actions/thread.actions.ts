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

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
	connectToDB();

	// calculate number of posts to skip based om page number and page size
	const skipAmount = (pageNumber - 1) * pageSize;

	// create query to fetch posts that have mo parent (top-level threads / threads that are not comments)
	const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
		.sort({ createdAt: "desc" })
		.skip(skipAmount)
		.limit(pageSize)
		.populate({ path: "author", model: User })
		.populate({ path: "community", model: Community })
		.populate({ path: "children", populate: { path: "author", model: User, select: "_id name parentId image" } }); // select only _id and username fileds of author

	// total number of top-level threads
	const totalPostCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });

	const posts = await postQuery.exec();

	const isNext = totalPostCount > skipAmount + posts.length;

	return { posts, isNext };
}
