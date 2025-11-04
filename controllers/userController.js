import user from "../Models/user.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const AddUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const FieldErrors = {};
      errors.array().forEach((err) => {
        const key = err.path;
        FieldErrors[key] = err.msg;
      });
      return res.status(400).json({
        message: "field missing",
        msg: FieldErrors,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const UserExist = await user.findOne({ username });
    if (UserExist) {
      return res.status(401).json({ message: "username already exist" });
    }
    const EmailExist = await user.findOne({ email });
    if (EmailExist) {
      return res.status(401).json({ message: "email already exist" });
    }
    const newUser = await user.create({
      username,
      password: hashedPassword,
      email,
    });
    res.status(201).json({ message: "data added", data: newUser });
  } catch (err) {
    console.log(err, "error is in the addind user in backend");
    res.status(500).json({ message: "server is error to do add user backend" });
  }
};

export const AllUser = async (req, res) => {
  try {
    const data = await user.find({ isDeleted: false });
    res.status(201).json({ message: "data fetched", data: data });
  } catch (err) {
    console.log(err, "error is in the view all user in backend");
    res
      .status(500)
      .json({ message: "server is error to do fetch user backend" });
  }
};



export const login =async(req,res)=>{
    const{username,email,password}=req.body

    const errors =validationResult(req)
    if(!errors.isEmpty()){
        const FieldErrors ={}
        errors.array().forEach((err)=>{
            const key= err.path
            FieldErrors[key]=err.msg
        })
        res.status(400).json({
            message:"feild missing",
            msg:FieldErrors
        })
    }
    const user1 =await user.findOne({$or:[{email:email},{username:username}],isDeleted:false})
    if(!user1){
        console.log("user not found")
        return res.status(404).json({message:"user not found"})
    }
    const stored =user1.password
    const checkingHashed = /^\$2[aby]\$\d{2}\$/.test(stored);
    let isMatch =false
    if(checkingHashed){
        isMatch = await bcrypt.compare(password,user1.password)
    }
    else{
        isMatch = password === stored
    }
    if(isMatch){
        const token = jwt.sign(
            {id:user1._id,username:user1.username},process.env.JWT_SECRET
        )
        const userData={id:user1._id,username:user1.username,email:user1.email}
        res.json({
            message:"login successfull",
            AccesToken:token,
            userData:userData
        })
    }
    else{
        res.status(401).json({message:"Invalid password"})
    }


}




export const UpdateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(404).json({ message: "user not found" });
    }
    
    const { username, password } = req.body;
    const UserExist = await user.findOne({username})
    if (UserExist) {
      return res.status(401).json({ message: "username already exist" });
    }
    const passwordPattern = /^.{7,}$/;
    if (!passwordPattern.test(password)) {
      return res
      .status(404)
      .json({ message: "password must contain 8 charecters " });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const update = await user.findByIdAndUpdate(userId, 
      {username,
      password: hashedPassword,}
      ,{new:true}
    );

    res.status(201).json({ message: "data have been updated", data:update });
  } catch (err) {
    console.log(err, "error on update user in backend");
    res.status(500).json({ message: "server is error to do update" });
  }
};


export const DeletUser =async(req,res)=>{
  try{
    const userId =req.user.id
    if(!userId){
      return res.status(401).json({message:"user not found"})
    }
    const deleted =await user.findByIdAndUpdate(userId,{isDeleted:true},{new:true})
    if(!deleted){
      return res.status(401).json({message:"data cant delete"})
    }
    res.status(201).json({message:"user have been deleted",data:deleted})
  }
  catch(err){
    console.log(err,"error is in the delete function")
    res.status(500).json({message:"server is error in the detele"})
  }
}
