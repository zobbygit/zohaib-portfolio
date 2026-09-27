import { Schema, model, type InferSchemaType } from "mongoose";

const messageSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 80 },
    email: { type: String, required: true, maxlength: 120 },
    projectType: { type: String, default: "", maxlength: 60 },
    message: { type: String, required: true, maxlength: 2000 },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export type MessageDoc = InferSchemaType<typeof messageSchema>;
export const Message = model("Message", messageSchema);
