import mongoose, { Schema } from "mongoose";

const topbarSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    topbars: {
        type: [String],
        default: ['All', 'Tech', 'Music', 'Playlists', 'New To You']
    }
})

export const Topbar  = mongoose.model("Topbar", topbarSchema)