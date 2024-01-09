"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

interface Props {
	id: string;
	name: string;
	username: string;
	imgUrl: string;
	personType: string;
}

function UserCard({ id, name, username, imgUrl, personType }: Props) {
	const router = useRouter();

	const isCommunity = personType === "Community";

	return (
		<article className="user-card">
			<div className="user-card_avatar">
				<div className="relative h-12 w-12">
					<Link href={`/profile/${id}`} className="relative h-11 w-11">
						<Image src={imgUrl} alt="user_logo" width={48} height={48} className="rounded-full object-cover" />
					</Link>
				</div>

				<div className="flex-1 text-ellipsis">
					<Link href={`/profile/${id}`} className="w-fit">
						<h4 className="text-base-semibold text-light-1">{name}</h4>
						<p className="text-small-medium text-gray-1">@{username}</p>
					</Link>
				</div>
			</div>

			<Button
				className="user-card_btn"
				onClick={() => {
					if (isCommunity) {
						router.push(`/communities/${id}`);
					} else {
						router.push(`/profile/${id}`);
					}
				}}
			>
				View
			</Button>
		</article>
	);
}

export default UserCard;
