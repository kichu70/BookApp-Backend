import multer, { diskStorage } from "multer";
import path from "path"


const storage =multer.diskStorage({
    destination:(req,file,cb)=>cb(null,"uploads/"),
    filename:(req,file,cb)=>{
        const ext =path.extname(file.originalname);
        cb(null,Date.now(+ext))
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype.startswith("image/"))cb(null,true)
    else cb(new Error("only image allowed"),false)

}

export const upload  =multer({
    storage,
    limits:{fileSize:5*1024*1024},
    fileFilter
})