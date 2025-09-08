import { Schema, model } from "mongoose";

const otherSchema = new Schema({
    accommodationPrice: {
        type: Number,
        required: true,
    }
}, {timestamps:true});

const Other = model('Other', otherSchema);

export default Other;