"use client";

import { useState } from "react";
import Image from "next/image";
import { likeThread } from "@/lib/actions/thread.actions";
import { usePathname } from "next/navigation";

interface Props {
	threadId: string;
	userId: string;
	isLiked: boolean;
}

const LikeButton = ({ threadId, userId, isLiked }: Props) => {
	const pathname = usePathname();
	const [liked, setLiked] = useState(isLiked);

	const like = () => {
		setLiked((prev) => !prev);
		likeThread({
			threadId: threadId,
			userId: JSON.parse(userId),
			path: pathname,
		});
	};

	return (
		<>
			{liked ? (
				<Image
					src="/heart-filled.svg"
					alt="heart"
					width={24}
					height={24}
					className="cursor-pointer object-contain hover:scale-[1.1]"
					title="Like"
					onClick={like}
				/>
			) : (
				<Image
					src="/heart-gray.svg"
					alt="heart"
					width={24}
					height={24}
					className="cursor-pointer object-contain hover:scale-[1.1]"
					title="Like"
					onClick={like}
				/>
			)}
		</>
	);
};

export default LikeButton;
