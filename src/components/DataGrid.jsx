// Importación de dependencias y uso del modo cliente
'use client'
import React, { useEffect, useState } from "react";
import { FiPackage, FiSearch, FiEdit, FiTrash2, FiEye, FiChevronUp, FiChevronDown } from "react-icons/fi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ItemsGrid() {
    // Estados para manejar los datos y la UI
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Configuración de ordenamiento
    const router = useRouter();

    // Efecto para cargar los items al montar el componente
    useEffect(() => {
        fetchItems();
    }, []);

    // Función para obtener los items desde la API
    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/items");
            const data = await response.json();

            if (Array.isArray(data)) {
                setItems(data);
            } else {
                setItems([]);
            }
        } catch (error) {
            console.error("Error al cargar items:", error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Función para ordenar los items
    const sortItems = (items) => {
        if (!sortConfig.key) return items;

        return [...items].sort((a, b) => {
            if (sortConfig.key === 'quantity' || sortConfig.key === 'code') {
                return sortConfig.direction === 'asc'
                    ? a[sortConfig.key] - b[sortConfig.key]
                    : b[sortConfig.key] - a[sortConfig.key];
            }

            if (sortConfig.key === 'createdAt') {
                return sortConfig.direction === 'asc'
                    ? new Date(a.createdAt) - new Date(b.createdAt)
                    : new Date(b.createdAt) - new Date(a.createdAt);
            }

            return sortConfig.direction === 'asc'
                ? a[sortConfig.key].localeCompare(b[sortConfig.key])
                : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        });
    };

    // Función para solicitar ordenamiento
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Función para obtener el ícono de ordenamiento
    const getSortIcon = (columnName) => {
        if (sortConfig.key !== columnName) {
            return <span className="ml-1 opacity-0 group-hover:opacity-50"><FiChevronUp /></span>;
        }
        return sortConfig.direction === 'asc'
            ? <span className="ml-1"><FiChevronUp /></span>
            : <span className="ml-1"><FiChevronDown /></span>;
    };

    // Filtrado de items basado en el término de búsqueda
    const filteredItems = items.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenamiento y paginación de items
    const sortedItems = sortItems(filteredItems);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

    // Función para eliminar un item
    const handleDelete = async (code) => {
        if (!code) return;

        const confirmed = confirm("¿Estás seguro de que deseas eliminar este item?");
        if (!confirmed) return;

        try {
            const response = await fetch('/api/items', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Item Eliminado');
                fetchItems();
            } else {
                toast.error(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error eliminando el item:", error);
            toast.error("Error al intentar eliminar el item.");
        }
    };

    return (
        <div className="w-full md:w-auto text-xs md:text-base">
            {/* Encabezado con título y barra de búsqueda */}
            <div className="flex flex-col md:flex-row md:justify-between mb-4 space-y-2 md:space-y-0">
                <h3 className="flex items-center gap-1.5 text-xl font-medium">
                    <FiPackage /> Items Registrados
                </h3>
                <div className="relative">
                    <input
                        type="text"
                        className="w-full md:w-auto border p-2 pl-8 rounded"
                        placeholder="Buscar por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FiSearch className="absolute left-2 top-3 text-gray-500" />
                </div>
            </div>

            {/* Selector de items por página */}
            <div className="flex justify-end mb-4 gap-2 items-center">
                <div className="flex gap-2 items-center">Ver
                    <select
                        className="border p-1 text-slate-500 rounded"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value="5">5 por página</option>
                        <option value="10">10 por página</option>
                        <option value="20">20 por página</option>
                    </select>
                </div>
            </div>

            {/* Tabla de items */}
            {loading ? (
                <p className="text-center py-4">Cargando...</p>
            ) : currentItems.length === 0 ? (
                <p className="text-center py-4">No se encontraron items.</p>
            ) : (
                <div className="overflow-x-auto md:overflow-x-visible">
                    <table className="min-w-full border border-gray-300 rounded">
                        <thead className="bg-slate-600">
                            <tr>
                                <th
                                    className="p-2 border group cursor-pointer whitespace-nowrap"
                                    onClick={() => requestSort('code')}
                                >
                                    <div className="flex items-center justify-center">
                                        Código {getSortIcon('code')}
                                    </div>
                                </th>
                                <th
                                    className="p-2 border group cursor-pointer whitespace-nowrap"
                                    onClick={() => requestSort('name')}
                                >
                                    <div className="flex items-center justify-center">
                                        Nombre {getSortIcon('name')}
                                    </div>
                                </th>
                                <th className="p-2 border whitespace-nowrap">Descripción</th>
                                <th
                                    className="p-2 border group cursor-pointer whitespace-nowrap"
                                    onClick={() => requestSort('quantity')}
                                >
                                    <div className="flex items-center justify-center">
                                        Cantidad {getSortIcon('quantity')}
                                    </div>
                                </th>
                                <th
                                    className="p-2 border group cursor-pointer whitespace-nowrap"
                                    onClick={() => requestSort('createdAt')}
                                >
                                    <div className="flex items-center justify-center">
                                        Fecha Creación {getSortIcon('createdAt')}
                                    </div>
                                </th>
                                <th className="p-2 border whitespace-nowrap">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index} className="border hover:bg-slate-100 hover:text-slate-900">
                                    <td className="p-2 border whitespace-nowrap">{item.code}</td>
                                    <td className="p-2 border whitespace-nowrap">{item.name}</td>
                                    <td className="p-2 border">{item.description}</td>
                                    <td className="p-2 border whitespace-nowrap">{item.quantity}</td>
                                    <td className="p-2 border whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td className="p-2 flex gap-2 justify-center whitespace-nowrap">
                                        <button
                                            className="text-red-500 py-4 hover:text-red-700"
                                            onClick={() => { handleDelete(item.code) }}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Controles de paginación */}
            <div className="flex flex-col sm:flex-row items-center justify-evenly gap-4 mt-4 w-full">
                <button
                    className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-50 hover:bg-slate-100"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span className="text-center">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    className="w-full sm:w-auto px-3 py-1 border rounded disabled:opacity-50 hover:bg-slate-100"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}
