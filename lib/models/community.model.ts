import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
	id: { type: String },
	name: { type: String },
	image: { type: String },
});

const Community = mongoose.models.Community || mongoose.model("Community", communitySchema);

export default Community;
