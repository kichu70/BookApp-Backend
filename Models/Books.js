import mongoose from "mongoose";

const BooksSchema = new mongoose.Schema(
  {
    bookname: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category:{
      type:String,
      required:true,
      enum: ["New", "Used"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userData",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Books = mongoose.model("Books-Data", BooksSchema);

export default Books;
