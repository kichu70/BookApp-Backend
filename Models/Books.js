import mongoose from "mongoose";


const BooksSchema =new mongoose.Schema({
        author:{
        type:String,
        required:true

    },    
    image:{
        type:[String],
        required:true
    },
    price:{
        type:Number,
        require:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userData',
        required: true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
const Books = mongoose.model("Books-Data",BooksSchema)

export default Books