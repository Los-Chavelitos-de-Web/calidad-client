import React, { useState } from 'react';
import { usePayload } from "../../../utils/authHelpers";

const FormularioProducto = () => {
  // Estado del producto
  const [producto, setProducto] = useState({
    title: '',
    description: '',
    brand: '',
    price: '', // String para el precio
    stock: '{}', // String JSON para el stock
    model: '',
    category: '',
    manufacturer: '',
    manualUrl: '',
    createdAt: new Date().toISOString()
  });

  // Estados auxiliares
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authToken } = usePayload();

  // Manejador de cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({
      ...producto,
      [name]: value
    });
    
    // Limpiar error si se corrige
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Manejador de cambios para el stock (mantenemos como string JSON)
  const handleStockChange = (e) => {
    const value = e.target.value;
    setProducto({
      ...producto,
      stock: value
    });
    
    // Limpiar error si existe
    if (errors.stock) {
      setErrors({
        ...errors,
        stock: null
      });
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones requeridas
    if (!producto.title.trim()) newErrors.title = 'Título es requerido';
    if (!producto.description.trim()) newErrors.description = 'Descripción es requerida';
    if (!producto.brand.trim()) newErrors.brand = 'Marca es requerida';
    if (!producto.category.trim()) newErrors.category = 'Categoría es requerida';
    
    // Validación para precio (string numérico)
    if (!producto.price.trim()) {
      newErrors.price = 'Precio es requerido';
    } else if (isNaN(Number(producto.price)) || Number(producto.price) <= 0) {
      newErrors.price = 'Precio debe ser un número positivo';
    }
    
    // Validación para stock (string JSON válido)
    try {
      JSON.parse(producto.stock);
    } catch (e) {
      newErrors.stock = 'Stock debe ser un JSON válido';
    }
    
    // Validación de URL si existe
    if (producto.manualUrl && !/^https?:\/\/.+\..+/.test(producto.manualUrl)) {
      newErrors.manualUrl = 'URL no válida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!authToken) {
      alert('No estás autenticado');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Enviamos price y stock como strings
      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/products/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(producto) 
      });

      const result = await response.json();

      if (response.ok) {
        alert("Producto insertado con éxito");
        // Resetear formulario
        setProducto({
          title: '',
          description: '',
          brand: '',
          price: '',
          stock: '{}',
          model: '',
          category: '',
          manufacturer: '',
          manualUrl: '',
          createdAt: new Date().toISOString()
        });
      } else {
        alert(`Error: ${result.message || 'No se pudo insertar el producto'}`);
      }
    } catch (err) {
      console.error('Error al enviar el formulario:', err);
      alert("Error al conectar con el servidor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Agregar nuevo producto</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            {/* Campo Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                name="title"
                value={producto.title}
                onChange={handleChange}
                placeholder="Nombre del producto"
                className={`w-full border rounded-md p-2 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>
            
            {/* Campo Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <textarea
                name="description"
                value={producto.description}
                onChange={handleChange}
                placeholder="Descripción detallada del producto"
                rows={3}
                className={`w-full border rounded-md p-2 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
            
            {/* Campo Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
              <input
                type="text"
                name="brand"
                value={producto.brand}
                onChange={handleChange}
                placeholder="Marca del producto"
                className={`w-full border rounded-md p-2 ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
            </div>
          </div>
          
          {/* Columna derecha */}
          <div className="space-y-4">
            {/* Campo Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                <input
                  type="text" // Usamos text en lugar de number para mantenerlo como string
                  name="price"
                  value={producto.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full border rounded-md p-2 pl-8 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                />
              </div>
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            
            {/* Campo Stock (JSON string) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock * (Formato JSON)</label>
              <textarea
                name="stock"
                value={producto.stock}
                onChange={handleStockChange}
                placeholder='{"almacen1": 10, "almacen2": 5}'
                rows={3}
                className={`w-full border rounded-md p-2 font-mono text-sm ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
            </div>
            
            {/* Campo Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                name="model"
                value={producto.model}
                onChange={handleChange}
                placeholder="Modelo/número de parte"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            
            {/* Campo Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
              <input
                type="text"
                name="category"
                value={producto.category}
                onChange={handleChange}
                placeholder="Categoría del producto"
                className={`w-full border rounded-md p-2 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
          </div>
        </div>
        
        {/* Campos adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo Fabricante */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fabricante</label>
            <input
              type="text"
              name="manufacturer"
              value={producto.manufacturer}
              onChange={handleChange}
              placeholder="Fabricante del producto"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          
          {/* Campo URL Manual */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL del Manual</label>
            <input
              type="url"
              name="manualUrl"
              value={producto.manualUrl}
              onChange={handleChange}
              placeholder="https://ejemplo.com/manual.pdf"
              className={`w-full border rounded-md p-2 ${errors.manualUrl ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.manualUrl && <p className="text-red-500 text-xs mt-1">{errors.manualUrl}</p>}
          </div>
        </div>
        
        {/* Campo oculto para createdAt */}
        <input type="hidden" name="createdAt" value={producto.createdAt} />
        
        {/* Botón de envío */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !authToken}
            className={`px-6 py-2 rounded-md text-white ${isSubmitting || !authToken ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? 'Enviando...' : 'Guardar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioProducto;