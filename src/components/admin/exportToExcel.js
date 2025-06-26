import * as XLSX from 'xlsx';

/**
 * Exporta datos de productos a Excel
 * @param {Array} products - Array de productos a exportar
 * @param {Function} getStock - Función para calcular stock
 * @param {String} fileName - Nombre base del archivo
 */
export const exportProductsToExcel = (products, getStock, fileName = 'Productos') => {
    if (!products || products.length === 0) {
        throw new Error('No hay datos para exportar');
    }

    // Preparar datos
    const excelData = products.map(product => ({
        'ID': product.id,
        'Nombre': product.title,
        'Marca': product.brand,
        'Modelo': product.model,
        'Categoría': product.category,
        'Stock Total': getStock(product.stock),
        'Precio': product.price || 'N/A',
        'Estado': product.status || 'Activo',
        'Fecha Creación': product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'
    }));

    // Crear hoja de cálculo
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajustar anchos de columnas
    ws['!cols'] = [
        { wch: 8 }, // ID
        { wch: 30 }, // Nombre
        { wch: 20 }, // Marca
        { wch: 20 }, // Modelo
        { wch: 20 }, // Categoría
        { wch: 12 }, // Stock
        { wch: 12 }, // Precio
        { wch: 15 }, // Estado
        { wch: 15 } // Fecha
    ];

    // Crear libro y exportar
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Productos");
    XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};