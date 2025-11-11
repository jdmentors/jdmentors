import { Schema, model } from "mongoose";

// const otherSchema = new Schema({
//     accommodationPrice: {
//         type: Number,
//         required: true,
//     }
// }, {timestamps:true});

// const Other = model('Other', otherSchema);

// export default Other;

// models/Other.js

const pricingSchema = new Schema({
  numberOfPeople: {
    type: Number,
    required: true,
    enum: [2, 3, 4, 5]
  },
  perPerson: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
});

const otherSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: "accommodation_pricing"
  },
  pricing: [pricingSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Other = model('Other', otherSchema);

export default Other;