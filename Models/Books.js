import mongoose from "mongoose";


// -------------------feed back of the book-----------------

const feedBackSchema = new mongoose.Schema(
  {
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"userData",
      required:true,
    },
    comment:{
      type:String,
      required:false
    },
    rating:{
      type:Number,
      min:1,
      max:5,
      required:false,
    },
  },
  {timestamps:true}
);

// --------------------book details  schema-------------------------
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
    feedbacks:[feedBackSchema],
  },
  {
    timestamps: true,
  }
);
const Books = mongoose.model("Books-Data", BooksSchema);

export default Books;

