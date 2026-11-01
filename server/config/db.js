import mongoose from 'mongoose';

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            // useNewUrlParser: true,         is commented because thia is not compaitable with the new version of the next js 
            // useUnifiedTopology: true,
        }).then(console.log("MongoDB connected successfully"))  ;
    } catch (error) {
        console.log("Mongo Db connection Error"+error)
        process.exit(1);
    }
}

export default connectDB;