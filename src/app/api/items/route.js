import {dbConnect} from "@/lib/dbConnect";
import Item from "@/models/item";

/* API */

/* Crear un nuevo item */
export async function POST(req){
    await dbConnect();

    const {code, name, description, quantity, createdAt} = await req.json();

    // Validar campos requeridos
    if(!code || !name || !description || !quantity){
        return new Response.json({error: "Todos los campos son requeridos"}, {status: 400});
    }

    // Crear nuevo item en la base de datos
    const newItem = await Item.create({code, name, description, quantity, createdAt});
    return Response.json(newItem, {status: 201});
}

/** Obtener todos los items */
export async function GET(req){
    await dbConnect();
    const items = await Item.find();
    return Response.json(items, {status: 200});
}

/* Eliminar un item por código */
export async function DELETE(req) {
    try {
        await dbConnect();
        const {code} = await req.json();

        // Validar que se proporcione el código
        if (!code) {
            return Response.json({ error: "Código es requerido" }, { status: 400 });
        }

        // Intentar eliminar el item
        const result = await Item.deleteOne({code});
        
        // Verificar si se encontró y eliminó el item
        if (result.deletedCount === 0) {
            return Response.json({ error: "Item no encontrado" }, { status: 404 });
        }

        return Response.json({ message: "Item eliminado correctamente" }, { status: 200 });
    } catch (error) {
        return Response.json({ error: "Error al procesar la solicitud" }, { status: 500 });
    }
}
