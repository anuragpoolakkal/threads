interface Props {
	threadId: string;
	currentUserId: string;
	authorId: string;
	parentId: string | null;
	isComment: boolean | undefined;
}

const DeleteThread = ({ threadId, currentUserId, authorId, parentId, isComment }: Props) => {
	return <div>DeleteThread</div>;
};
export default DeleteThread;
