import React from 'react'

const LowStockProducts = ({ productos, isLoading }) => {
  // Función para calcular el stock total
  const calcularStock = (stockData) => {
    if (!stockData) return 0;
    return Object.values(stockData).reduce((sum, val) => sum + (val || 0), 0);
  };

  // Obtener los 5 productos con menos stock
  const getProductosConMenosStock = () => {
    if (!productos.length) return [];
    
    return [...productos]
      .map(producto => ({
        ...producto,
        stockTotal: calcularStock(producto.stock)
      }))
      .sort((a, b) => a.stockTotal - b.stockTotal)
      .slice(0, 5);
  };

  return (
    <div className="low-stock-section">
      <h2 className="section-title">Productos con bajo stock</h2>
      {isLoading ? (
        <p>Cargando información de stock...</p>
      ) : (
        <div className="low-stock-table-container">
          <table className="low-stock-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Stock Total</th>
              </tr>
            </thead>
            <tbody>
              {getProductosConMenosStock().length > 0 ? (
                getProductosConMenosStock().map((producto) => (
                  <tr key={producto.id} className={producto.stockTotal === 0 ? 'out-of-stock' : 'low-stock'}>
                    <td>{producto.title}</td>
                    <td>{producto.brand}</td>
                    <td>{producto.model || 'N/A'}</td>
                    <td>{producto.stockTotal}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">No hay datos de productos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LowStockProducts;