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

export async function fetchThreadById(threadId: string) {
	connectToDB();

	try {
		const thread = await Thread.findById(threadId)
			.populate({
				path: "author",
				model: User,
				select: "_id id name username image",
			}) // populate author field with _id and username
			.populate({
				path: "community",
				model: Community,
				select: "_id id name image",
			}) // populate community field with _id and name
			.populate({
				path: "children", // populate children field
				populate: [
					{
						path: "author", // populate the author field within children
						model: User,
						select: "_id id name username parentId image", // select only _id and username fields of the author
					},
					{
						path: "children", // populate the children field within children
						model: Thread, // the model of the nested children (assuming it's the same "Thread" model)
						populate: {
							path: "author", // populate the author field within nested children
							model: User,
							select: "_id id name parentId image", // select only _id and username fields of the author
						},
					},
				],
			});
		return thread;
	} catch (error) {
		console.error("Error while fetching thread:", error);
		throw new Error("Unable to fetch thread");
	}
}

export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
	try {
		connectToDB();

		// find the original thread by its id
		const originalThread = await Thread.findById(threadId);

		if (!originalThread) throw new Error("Thread not found");

		// create new comment thread
		const commentThread = new Thread({ text: commentText, author: userId, parentId: threadId }); // parentId is original thread's id

		// save the comment thread to the database
		const savedCommentThread = await commentThread.save();

		// add the comment thread's id to the original thread's children array
		originalThread.children.push(savedCommentThread._id);

		// save the updated original thread to the database
		await originalThread.save();

		revalidatePath(path);
	} catch (err) {
		console.error("Error while adding comment:", err);
		throw new Error("Unable to add comment");
	}
}
