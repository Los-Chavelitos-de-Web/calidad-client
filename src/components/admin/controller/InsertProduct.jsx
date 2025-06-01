import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAside from '../template/AdminAside';

const InsertProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brand: '',
    price: 0,
    stock: {},
    model: '',
    category: '',
    manufacturer: '',
    specs: {},
    manualUrl: ''
  });
  
  const [stockInput, setStockInput] = useState({ location: '', quantity: 0 });
  const [specInput, setSpecInput] = useState({ key: '', value: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Manejador de cambios para campos normales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador de cambios para stock
  const handleStockChange = (e) => {
    const { name, value } = e.target;
    setStockInput(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };

  // Agrega nueva ubicación de stock
  const addStock = () => {
    if (stockInput.location && stockInput.quantity >= 0) {
      setFormData(prev => ({
        ...prev,
        stock: {
          ...prev.stock,
          [stockInput.location]: stockInput.quantity
        }
      }));
      setStockInput({ location: '', quantity: 0 });
    }
  };

  // Elimina ubicación de stock
  const removeStock = (location) => {
    const newStock = { ...formData.stock };
    delete newStock[location];
    setFormData(prev => ({ ...prev, stock: newStock }));
  };

  // Manejador de cambios para especificaciones
  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setSpecInput(prev => ({ ...prev, [name]: value }));
  };

  // Agrega nueva especificación técnica
  const addSpec = () => {
    if (specInput.key && specInput.value) {
      setFormData(prev => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specInput.key]: specInput.value
        }
      }));
      setSpecInput({ key: '', value: '' });
    }
  };

  // Elimina especificación técnica
  const removeSpec = (key) => {
    const newSpecs = { ...formData.specs };
    delete newSpecs[key];
    setFormData(prev => ({ ...prev, specs: newSpecs }));
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Validación de campos obligatorios según tu tabla
      if (!formData.title || !formData.brand || !formData.category) {
        throw new Error('Título, Marca y Categoría son campos obligatorios');
      }

      // Prepara los datos para enviar
      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        stock: formData.stock,
        specs: formData.specs
      };

      console.log('Enviando datos:', productData); // Para depuración

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_APP_BACK}/api/v1/products/insert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      console.log('Respuesta del servidor:', response); // Para depuración

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Error ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      setSuccess(`Producto creado exitosamente! ID: ${result.id || 'N/A'}`);
      
      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          brand: '',
          price: 0,
          stock: {},
          model: '',
          category: '',
          manufacturer: '',
          specs: {},
          manualUrl: ''
        });
        setSuccess('');
        navigate('/admin/productos');
      }, 2000);

    } catch (err) {
      console.error('Error completo:', err);
      setError(`Error al guardar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-aside-wrapper">
        <AdminAside />
      </div>
      
      <div className="admin-main-content">
        <div className="insert-product-container">
          <h2>Agregar Nuevo Producto</h2>
          
          {/* Mensajes de estado */}
          {error && (
            <div className="alert error">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          {success && (
            <div className="alert success">
              <strong>Éxito:</strong> {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Sección 1: Información Básica */}
            <div className="form-section">
              <h3>Información Básica</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Título*</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Motosierra profesional"
                  />
                </div>
                
                <div className="form-group">
                  <label>Marca*</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    placeholder="Ej: CIFARELLI"
                  />
                </div>
                
                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    maxLength={1500}
                    rows={3}
                    placeholder="Descripción detallada del producto (máx. 1500 caracteres)"
                  />
                </div>
                
                <div className="form-group">
                  <label>Precio (USD)*</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                  />
                </div>
                
                <div className="form-group">
                  <label>Modelo</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="Ej: C7"
                  />
                </div>
                
                <div className="form-group">
                  <label>Categoría*</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Motosierras"
                  />
                </div>
                
                <div className="form-group">
                  <label>Fabricante</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="Ej: CIFARELLI S.P.A."
                  />
                </div>
                
                <div className="form-group">
                  <label>URL del Manual</label>
                  <input
                    type="url"
                    name="manualUrl"
                    value={formData.manualUrl}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* Sección 2: Gestión de Inventario */}
            <div className="form-section">
              <h3>Gestión de Inventario</h3>
              <div className="stock-input">
                <div className="form-group">
                  <label>Ubicación</label>
                  <input
                    type="text"
                    name="location"
                    value={stockInput.location}
                    onChange={handleStockChange}
                    placeholder="Ej: Almacén Central"
                  />
                </div>
                
                <div className="form-group">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    name="quantity"
                    value={stockInput.quantity}
                    onChange={handleStockChange}
                    min="0"
                    placeholder="0"
                  />
                </div>
                
                <button 
                  type="button" 
                  onClick={addStock}
                  className="add-btn"
                  disabled={!stockInput.location || stockInput.quantity < 0}
                >
                  Agregar Stock
                </button>
              </div>
              
              <div className="stock-list">
                {Object.keys(formData.stock).length > 0 ? (
                  Object.entries(formData.stock).map(([location, quantity]) => (
                    <div key={location} className="stock-item">
                      <span className="stock-location">{location}:</span>
                      <span className="stock-quantity">{quantity} unidades</span>
                      <button 
                        type="button" 
                        onClick={() => removeStock(location)}
                        className="remove-btn"
                        title="Eliminar ubicación"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No se han agregado ubicaciones de stock</p>
                )}
              </div>
            </div>

            {/* Sección 3: Especificaciones Técnicas */}
            <div className="form-section">
              <h3>Especificaciones Técnicas</h3>
              <div className="specs-input">
                <div className="form-group">
                  <label>Clave</label>
                  <input
                    type="text"
                    name="key"
                    value={specInput.key}
                    onChange={handleSpecChange}
                    placeholder="Ej: Potencia"
                  />
                </div>
                
                <div className="form-group">
                  <label>Valor</label>
                  <input
                    type="text"
                    name="value"
                    value={specInput.value}
                    onChange={handleSpecChange}
                    placeholder="Ej: 5 HP"
                  />
                </div>
                
                <button 
                  type="button" 
                  onClick={addSpec}
                  className="add-btn"
                  disabled={!specInput.key || !specInput.value}
                >
                  Agregar Especificación
                </button>
              </div>
              
              <div className="specs-list">
                {Object.keys(formData.specs).length > 0 ? (
                  Object.entries(formData.specs).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <span className="spec-key">{key}:</span>
                      <span className="spec-value">{value}</span>
                      <button 
                        type="button" 
                        onClick={() => removeSpec(key)}
                        className="remove-btn"
                        title="Eliminar especificación"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No se han agregado especificaciones</p>
                )}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="form-actions">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span> Guardando...
                  </>
                ) : (
                  'Guardar Producto'
                )}
              </button>
              
              <button 
                type="button" 
                onClick={() => navigate('/admin/productos')}
                className="cancel-btn"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InsertProduct;