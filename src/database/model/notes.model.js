import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator(value) {
          // A title with no letters is not considered uppercase; otherwise require a lowercase letter.
          return !/[a-z]/i.test(value) || value !== value.toUpperCase();
        },
        message: "Title cannot be entirely uppercase"
      }
    },
    content: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true, collection: "notes" }
);

export const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
