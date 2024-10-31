import mongoose, { Schema } from "mongoose";

const refSchema = new Schema({
    user:{type: mongoose.Types.ObjectId, ref: 'User', required:true},
    videos:[{type: mongoose.Types.ObjectId, ref:'Video'}]
})

export const Ref = mongoose.model("Ref", refSchema);