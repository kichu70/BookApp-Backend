import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true

    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true
})

const user = mongoose.model("userData",UserSchema)

export default user;