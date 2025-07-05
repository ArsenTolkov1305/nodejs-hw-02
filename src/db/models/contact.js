import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    photo: { type: String },
    isFavourite: { type: Boolean, default: false },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      required: true,
    },
  },
  { timestamps: true },
);

export const Contact = model('Contact', contactSchema);