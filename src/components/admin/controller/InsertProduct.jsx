import React, { useState } from 'react';
import { usePayload } from "../../../utils/authHelpers";
import '../admin-css/insert-prod.css';

const FormularioProducto = ({ isOpen, onClose, onProductCreated }) => {
  const [producto, setProducto] = useState({
    title: '',
    description: '',
    brand: '',
    price: '',
    stock: '{}',
    specs: '{}',
    model: '',
    category: '',
    manufacturer: '',
    manualUrl: '',
    createdAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authToken } = usePayload();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({
      ...producto,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!producto.title.trim()) newErrors.title = 'Título es requerido';
    if (!producto.description.trim()) newErrors.description = 'Descripción es requerida';
    if (!producto.brand.trim()) newErrors.brand = 'Marca es requerida';
    if (!producto.category.trim()) newErrors.category = 'Categoría es requerida';

    if (!producto.price.trim()) {
      newErrors.price = 'Precio es requerido';
    } else if (isNaN(Number(producto.price)) || Number(producto.price) <= 0) {
      newErrors.price = 'Precio debe ser un número positivo';
    }

    try {
  const parsedStock = JSON.parse(producto.stock);
  if (typeof parsedStock !== 'object' || Array.isArray(parsedStock)) {
    newErrors.stock = 'El stock debe ser un objeto JSON válido';
  }
} catch (e) {
  newErrors.stock = 'Formato JSON inválido en el stock';
}


    if (producto.manualUrl && !/^https?:\/\/.+\..+/.test(producto.manualUrl)) {
      newErrors.manualUrl = 'URL no válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!authToken) {
      alert('No estás autenticado');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...producto,
        price: Number(producto.price),
        stock: JSON.parse(producto.stock),
        specs: JSON.parse(producto.specs)
      };

      console.log("Payload enviado:", payload);

      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/products/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Producto insertado con éxito");
        setProducto({
          title: '',
          description: '',
          brand: '',
          price: '',
          stock: '{}',
          specs: '{}',
          model: '',
          category: '',
          manufacturer: '',
          manualUrl: '',
          createdAt: new Date().toISOString()
        });
        onProductCreated();
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Agregar nuevo producto</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna izquierda */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                  <input
                    type="text"
                    name="title"
                    value={producto.title}
                    onChange={handleChange}
                    className={`w-full border rounded-md p-2 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                  <textarea
                    name="description"
                    value={producto.description}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full border rounded-md p-2 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
                  <input
                    type="text"
                    name="brand"
                    value={producto.brand}
                    onChange={handleChange}
                    className={`w-full border rounded-md p-2 ${errors.brand ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      name="price"
                      value={producto.price}
                      onChange={handleChange}
                      className={`w-full border rounded-md p-2 pl-8 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                    />
                  </div>
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                {/*Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock * (Formato JSON)</label>
                  <textarea
                    name="stock"
                    value={producto.stock}
                    onChange={handleChange}
                    placeholder='{"almacen1": 10, "almacen2": 5}'
                    rows={3}
                    className={`w-full border rounded-md p-2 font-mono text-sm ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                </div>

                {/*Especificaciones */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especificaciones * (Formato JSON)</label>
                  <textarea
                    name="specs"
                    value={producto.specs}
                    onChange={handleChange}
                    placeholder='{"almacen1": 10, "almacen2": 5}'
                    rows={3}
                    className={`w-full border rounded-md p-2 font-mono text-sm ${errors.specs ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.specs && <p className="text-red-500 text-xs mt-1">{errors.specs}</p>}
                </div>

              {/*Modelo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                  <input
                    type="text"
                    name="model"
                    value={producto.model}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                  <input
                    type="text"
                    name="category"
                    value={producto.category}
                    onChange={handleChange}
                    className={`w-full border rounded-md p-2 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
              </div>
            </div>

            {/* Campos adicionales */}
            <div className="form-grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fabricante</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={producto.manufacturer}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL del Manual</label>
                <input
                  type="url"
                  name="manualUrl"
                  value={producto.manualUrl}
                  onChange={handleChange}
                  className={`w-full border rounded-md p-2 ${errors.manualUrl ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.manualUrl && <p className="text-red-500 text-xs mt-1">{errors.manualUrl}</p>}
              </div>
            </div>

            <input type="hidden" name="createdAt" value={producto.createdAt} />

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 mr-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
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
      </div>
    </div>
  );
};

export default FormularioProducto;
