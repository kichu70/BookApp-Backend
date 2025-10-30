import { validationResult } from "express-validator";
import Books from "../Models/Books.js";
export const AddBook = async (req, res) => {
  try {
    const { bookname, category, author, description, price, user } = req.body;

    const userId = req.user.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const FeildErrors = {};
      errors.array().forEach((err) => {
        const key = err.path;
        FeildErrors[key] = err.msg;
      });
      return res.status(400).json({
        message: "feild missilg",
        msg: FeildErrors,
      });
    }
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is requierd" });
    }
    const imagePaths = req.files.map((file) => file.path);

    const newBook = await Books.create({
      bookname,
      author,
      image: imagePaths,
      description,
      price,
      category,
      user: userId,
    });
    res.status(201).json({
      message: "New Book added",
      data: newBook,
    });
  } catch (err) {
    console.log(err, "error in the books adding");
    res.status(500).json({ message: "server error", Error: err.message });
  }
};

export const allBooks = async (req, res) => {
  try {
    const page=parseInt(req.query.page)||1;
    const limit=parseInt(req.query.limit)||8;


    const skip=(page -1)*limit;

    const total=await Books.countDocuments({isDeleted:false})

    const data = await Books.find({ isDeleted: false })
    .skip(skip)
    .limit(limit)
    res.status(201).json({
      totalPage:Math.ceil(total/limit),
      totalIteam:total,
      message: "Books are",
      data: data,
    });
  } catch (err) {
    console.log(err, "error is in the view all book");
  }
};

export const UpdateBook = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;
    const data = await Books.find({ user: userId, _id: id, isDeleted: false });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const FeildErrors = {};
      errors.array().forEach((err) => {
        const key = err.path;
        FeildErrors[key] = err.msg;
      });
      return res.status(400).json({
        message: "feild missilg",
        msg: FeildErrors,
      });
    }
    const data1 = data.find((p) => p.id === id);
    if (!data1) {
      console.log("Access denied");
      return res.json({ message: "cant't update the book" });
    }
    const { bookname, author, category, description, price } = req.body;
    const UpdatedBook = await Books.findByIdAndUpdate(
      id,
      { bookname, author, category, description, price },
      {
        new: true,
      }
    );
    if (!UpdatedBook) {
      return res.status(404).json({ message: "book not found" });
    }
    res
      .status(201)
      .json({ message: "Book have been updated", data: UpdatedBook });
  } catch (err) {
    res.status(500).json({ message: "server Error", Error: err.message });
    console.error(err, "catch");
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.query;
    const userId = req.user.id;
    const book = await Books.find({ user: userId, _id: id, isDeleted: false });
    if (!book) {
      return res.status(404).json({ message: "Book not found" }, id);
    }
    const dltData = await Books.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!dltData) {
      return res.status(404).json({ message: "page Not Found" });
    }
    res.status(201).json({ message: "book have been deleted", data: dltData });
  } catch (err) {
    console.log(err, "error is in the delete function ");
    res.status(500).json("server error");
  }
};

export const sinlgeBook = async (req, res) => {
  try {
    const {id} =req.query;
    const book =await Books.find({isDeleted:false,_id:id})
    res.status(201).json({message:"the single book is",data:book})    
  } catch (err) {
    console.log(err, "error is in the fathing single book");
  }
};

export const oldBooks = async (req, res) => {
  try {
    const data = await Books.find({ isDeleted: false, category: "Used" });
    res.status(201).json({ message: "old books are", data: data });
  } catch (err) {
    console.log(err, "error is in the oldbook");
    res.status(500).json({ message: "error is in the oldbook sever error" });
  }
};
export const newBooks = async (req, res) => {
  try {
    const data = await Books.find({ isDeleted: false, category: "New" });
    res.status(201).json({ message: "newBooks are", data: data });
  } catch (err) {
    console.log(err, "error is in the NewBook");
    res.status(500).json({ message: "error is in the NewBook's sever error" });
  }
};
