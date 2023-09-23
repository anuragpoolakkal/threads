import Image from "next/image";
import Link from "next/link";
import DeleteThread from "../forms/DeleteThread";
import { formatDateString } from "@/lib/utils";
// import DomParser from "dom-parser";

interface Props {
	id: string;
	currentUserId: string;
	parentId: string | null;
	content: string;
	author: {
		name: string;
		username?: string;
		image: string;
		id: string;
	};
	community: {
		id: string;
		name: string;
		image: string;
	} | null;
	createdAt: string;
	comments: {
		author: {
			image: string;
		};
	}[];
	isComment?: boolean;
}

const ThreadCard = ({
	id,
	currentUserId,
	parentId,
	content,
	author,
	community,
	createdAt,
	comments,
	isComment,
}: Props) => {
	// const postContent = content.replaceAll("\n", "<br />");

	// const parser = new DomParser();
	// const htmlContent: any = parser.parseFromString(postContent);

	return (
		<article className={`flex flex-col rounded-xl w-full ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-5"}`}>
			<div className="flex items-start justify-between">
				<div className="flex w-full flex-1 flex-row gap-4">
					<div className="flex flex-col items-center">
						<Link href={`/profile/${author.id}`} className="relative h-11 w-11">
							<Image
								src={author.image}
								alt="user_community_image"
								fill
								className="cursor-pointer rounded-full"
							/>
						</Link>

						<div className="thread-card_bar" />
					</div>

					<div className="flex w-full flex-col">
						<Link href={`/profile/${author.id}`} className="w-fit">
							<h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
							<p className="text-small text-gray-1">@{author.username}</p>
						</Link>

						<p className="mt-2 text-smaller-regular text-light-2">{content}</p>

						<div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
							<div className="flex gap-3.5">
								<Image
									src="/heart-gray.svg"
									alt="heart"
									width={24}
									height={24}
									className="cursor-pointer object-contain"
								/>
								<Link href={`/thread/${id}`}>
									<Image
										src="/reply.svg"
										alt="reply"
										width={24}
										height={24}
										className="cursor-pointer object-contain"
									/>
								</Link>
								<Image
									src="/repost.svg"
									alt="repost"
									width={24}
									height={24}
									className="cursor-pointer object-contain"
								/>
								<Image
									src="/share.svg"
									alt="share"
									width={24}
									height={24}
									className="cursor-pointer object-contain"
								/>
							</div>

							{isComment && comments.length > 0 && (
								<Link href={`/threads/${id}`}>
									<p className="mt-1 text-subtle-medium text-gray-1">
										{comments.length} repl{comments.length > 1 ? "ies" : "y"}
									</p>
								</Link>
							)}
						</div>
					</div>
				</div>

				<DeleteThread
					threadId={JSON.stringify(id)}
					currentUserId={currentUserId}
					authorId={author.id}
					parentId={parentId}
					isComment={isComment}
				/>
			</div>

			{isComment && comments.length > 0 && (
				<div className="ml-1 mt-3 flex items-center gap-2">
					{comments.slice(0, 2).map((comment, index) => (
						<Image
							key={index}
							src={comment.author.image}
							alt={`user_${index}`}
							width={24}
							height={24}
							className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
						/>
					))}
					<Link href={`/threads/${id}`}>
						<p className="mt-1 text-subtle-medium text-gray-1">
							{comments.length} repl{comments.length > 1 ? "ies" : "y"}
						</p>
					</Link>
				</div>
			)}

			{!isComment && community && (
				<Link href={`/community/${community.id}`} className="mt-5 flex items-center">
					<p className="text-subtle-medium text-gray-1">
						{formatDateString(createdAt)}
						{community && `- ${community.name} Community`}
					</p>

					<Image
						src={community.image}
						alt={community.name}
						width={14}
						height={14}
						className="ml-1 object-cover rounded-full"
					/>
				</Link>
			)}
		</article>
	);
};
export default ThreadCard;