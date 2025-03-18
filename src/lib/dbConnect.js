import mongoose from "mongoose";

export async function dbConnect() {
    if (mongoose.connection.readyState >= 1) return;

    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado a MongoDB");
    } catch (error) {
        console.error("Error al conectar a MongoDB ", error);
    }
}
