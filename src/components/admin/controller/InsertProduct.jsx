import React, { useState } from 'react';
import { usePayload } from "../../../utils/authHelpers";
import '../admin-css/insert-prod.css';

const FormularioProducto = ({ isOpen, onClose, onProductCreated }) => {
  const [producto, setProducto] = useState({
    title: '',
    description: '',
    brand: '',
    price: '',
    model: '',
    category: '',
    manufacturer: '',
    manualUrl: '',
    createdAt: new Date().toISOString()
  });

  const [stockFields, setStockFields] = useState({
    piura: 0,
    sullana: 0,
    tambogrande: 0
  });

  const [specsList, setSpecsList] = useState([{ key: '', value: '' }]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authToken } = usePayload();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!producto.title.trim()) newErrors.title = 'Título es requerido';
    if (!producto.description.trim()) newErrors.description = 'Descripción es requerida';
    if (!producto.brand.trim()) newErrors.brand = 'Marca es requerida';
    if (!producto.category.trim()) newErrors.category = 'Categoría es requerida';
    if (!producto.price.trim() || isNaN(Number(producto.price)) || Number(producto.price) <= 0) {
      newErrors.price = 'Precio debe ser un número positivo';
    }
    if (producto.manualUrl && !/^https?:\/\/.+\..+/.test(producto.manualUrl)) {
      newErrors.manualUrl = 'URL no válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || !authToken) return;

    setIsSubmitting(true);
    try {
      const specsObject = specsList.reduce((acc, curr) => {
        if (curr.key.trim()) acc[curr.key] = curr.value;
        return acc;
      }, {});

      const payload = {
        ...producto,
        price: Number(producto.price),
        stock: stockFields,
        specs: specsObject
      };

      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/products/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
          
        },
        
        body: JSON.stringify(payload)
      });
      console.log("Token:", authToken);
console.log("Producto ID:", producto.id);


      const result = await response.json();

      if (response.ok) {
        alert("Producto insertado con éxito");
        setProducto({
          title: '', description: '', brand: '', price: '', model: '',
          category: '', manufacturer: '', manualUrl: '', createdAt: new Date().toISOString()
        });
        setStockFields({ piura: 0, sullana: 0, tambogrande: 0 });
        setSpecsList([{ key: '', value: '' }]);
        onProductCreated();
      } else {
        alert(`Error: ${result.message || 'No se pudo insertar el producto'}`);
      }
    } catch (err) {
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input label="Título *" name="title" value={producto.title} onChange={handleChange} error={errors.title} />
              <Textarea label="Descripción *" name="description" value={producto.description} onChange={handleChange} error={errors.description} />
              <Input label="Marca *" name="brand" value={producto.brand} onChange={handleChange} error={errors.brand} />
            </div>

            <div className="space-y-4">
              <Input label="Precio *" name="price" value={producto.price} onChange={handleChange} error={errors.price} type="number" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock por almacén *</label>
                {Object.keys(stockFields).map((city) => (
                  <div key={city} className="mb-2">
                    <label className="text-xs font-medium capitalize">{city}</label>
                    <input
                      type="number"
                      name={city}
                      value={stockFields[city]}
                      onChange={(e) => setStockFields({ ...stockFields, [city]: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Especificaciones</label>
                {specsList.map((spec, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Especificación"
                      value={spec.key}
                      onChange={(e) => {
                        const newSpecs = [...specsList];
                        newSpecs[index].key = e.target.value;
                        setSpecsList(newSpecs);
                      }}
                      className="w-1/3 border border-gray-300 rounded-md p-2"
                    />
                    <input
                      type="text"
                      placeholder="Valor"
                      value={spec.value}
                      onChange={(e) => {
                        const newSpecs = [...specsList];
                        newSpecs[index].value = e.target.value;
                        setSpecsList(newSpecs);
                      }}
                      className="w-1/2 border border-gray-300 rounded-md p-2"
                    />
                    <button type="button" className="eliminar-spec" onClick={() => {
                      const newSpecs = specsList.filter((_, i) => i !== index);
                      setSpecsList(newSpecs.length === 0 ? [{ key: '', value: '' }] : newSpecs);
                    }}>❌</button>
                  </div>
                ))}
                <button type="button" className="agregar-spec" onClick={() => setSpecsList([...specsList, { key: '', value: '' }])}>
                  + Añadir especificación
                </button>
              </div>
              <Input label="Modelo" name="model" value={producto.model} onChange={handleChange} />
              <Input label="Categoría *" name="category" value={producto.category} onChange={handleChange} error={errors.category} />
            </div>
          </div>

          <div className="form-grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Fabricante" name="manufacturer" value={producto.manufacturer} onChange={handleChange} />
            <Input label="URL del Manual" name="manualUrl" value={producto.manualUrl} onChange={handleChange} error={errors.manualUrl} type="url" />
          </div>

          <input type="hidden" name="createdAt" value={producto.createdAt} />

          <div className="flex justify-end pt-4 gap-4">
            <button type="button" className="cancelar" onClick={onClose}>Cancelar</button>
            <button type="submit" className='guardar' disabled={isSubmitting || !authToken}>
              {isSubmitting ? 'Enviando...' : 'Guardar Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componentes reutilizables
const Input = ({ label, name, value, onChange, error, type = "text", prefix }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{prefix}</span>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-md p-2 ${prefix ? 'pl-8' : ''} ${error ? 'border-red-500' : 'border-gray-300'}`}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Textarea = ({ label, name, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={3}
      className={`w-full border rounded-md p-2 ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default FormularioProducto;
