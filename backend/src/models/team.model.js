import { model, Schema } from "mongoose";

const teamSchema = new Schema({
    fullName: {
        type: String,
        trim: true,
        required: true,
        index: true
    },
    designation: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        trim: true
    },
}, { timestamps: true });

const Team = model('Team', teamSchema);

export default Team;