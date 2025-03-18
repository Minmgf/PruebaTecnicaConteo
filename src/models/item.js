import mongoose from "mongoose";

// Definición del esquema para los items
const itemSchema = new mongoose.Schema({
    // Código único del item
    code: {
        type: Number,
        unique: true,
    },
    // Nombre del item
    name: {
        type: String,
        required: true,
    },
    // Descripción del item
    description: {
        type: String,
        required: true,
    },
    // Cantidad disponible
    quantity: {
        type: Number,
        required: true,
    },
    // Fecha de creación
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

// Exportar el modelo Item, creándolo si no existe
export default mongoose.models.Item || mongoose.model("Item", itemSchema);
