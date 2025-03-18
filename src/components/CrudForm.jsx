'use client'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'

// Componente de formulario para crear elementos
const CrudForm = () => {
    // Estado del formulario con valores iniciales
    const [formData, setFormData] = useState({
        code: Math.floor(Math.random() * 1000000), // Genera un código aleatorio
        name: '',
        description: '',
        quantity: 0,
        createdAt: new Date()
    })

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Realiza la petición POST a la API
        const response = await fetch("/api/items", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        });

        // Maneja la respuesta de la API
        if (response.ok) {
            toast.success("Elemento creado correctamente");
            // Resetea el formulario con valores iniciales
            setFormData({
                code: Math.floor(Math.random() * 1000000),
                name: '',
                description: '',
                quantity: 0,
                createdAt: new Date()
            })
        } else {
            toast.error("Error al crear el elemento");
        }
    }

    return (
        // Formulario con estilos de Tailwind
        <form className="flex flex-col gap-2 max-w-[80%] mx-auto" onSubmit={handleSubmit}>
            {/* Campo para el nombre */}
            <label className="flex flex-col gap-2">
                <span>Nombre:</span>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ingresa el nombre:"
                    className="border rounded p-2"
                />
            </label>

            {/* Campo para la descripción */}
            <label className="flex flex-col gap-2">
                <span>Descripción:</span>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Ingresa la descripción:"
                    className="border rounded p-2"
                />
            </label>

            {/* Campo para la cantidad */}
            <label className="flex flex-col gap-2">
                <span>Cantidad:</span>
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Ingresa la cantidad:"
                    className="border rounded p-2"
                />
            </label>

            {/* Botón de envío */}
            <button
                type="submit"
                className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mt-4"
            >
                Crear Elemento
            </button>
        </form>
    )
}

export default CrudForm
