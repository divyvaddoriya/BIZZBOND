import mongoose from "mongoose";

const connectDB =async ()=>{
    try {
        // await mongoose.connect(process.env.MONGODB_URL)
      await mongoose.connect(process.env.MONGODB_URL);
        console.log("successfully connect to mongodb")
    }
    catch(error){
        console.error(`ERROR : ${error.message}`);
        process.exit(1);
    }
}

export default connectDB