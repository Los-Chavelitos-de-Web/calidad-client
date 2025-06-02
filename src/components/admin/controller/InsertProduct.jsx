import React, { useState } from 'react';

const FormularioProducto = () => {
  const [producto, setProducto] = useState(
    {
    title: '',
    description: '',
    brand: '',
    price: '',
    stock: {}, // objeto JSON
    model: '',
    category: '',
    manufacturer: '',
    specs: {}, // objeto JSON
    manualUrl: ''
  });

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  // Manejo especial para JSON (stock y specs)
  const handleJsonChange = (e) => {
    try {
      const jsonValue = JSON.parse(e.target.value);
      setProducto({
        ...producto,
        [e.target.name]: jsonValue
      });
    } catch (err) {
      alert("Formato JSON inválido en " + e.target.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.BACK_URL}/products/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
      });

      const result = await response.json();

      if (response.ok) {
        alert("Producto insertado con éxito");
      } else {
        alert("Error: " + result.mensaje);
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-4 border rounded">
      <h2 className="text-xl font-bold">Agregar nuevo producto</h2>

      <input type="text" name="title" value={producto.title} onChange={handleChange} placeholder="Título" required className="w-full border p-2" />
      <textarea name="description" value={producto.description} onChange={handleChange} placeholder="Descripción" className="w-full border p-2" required />
      <input type="text" name="brand" value={producto.brand} onChange={handleChange} placeholder="Marca" className="w-full border p-2" required />
      <input type="number" name="price" value={producto.price} onChange={handleChange} placeholder="Precio" step="0.01" className="w-full border p-2" required />
      <textarea name="stock" onChange={handleJsonChange} placeholder='Stock (JSON ej: {"tienda1": 20})' className="w-full border p-2" />
      <input type="text" name="model" value={producto.model} onChange={handleChange} placeholder="Modelo" className="w-full border p-2" />
      <input type="text" name="category" value={producto.category} onChange={handleChange} placeholder="Categoría" className="w-full border p-2" />
      <input type="text" name="manufacturer" value={producto.manufacturer} onChange={handleChange} placeholder="Fabricante" className="w-full border p-2" />
      <textarea name="specs" onChange={handleJsonChange} placeholder='Especificaciones (JSON ej: {"color": "negro", "peso": "1kg"})' className="w-full border p-2" />
      <input type="url" name="manualUrl" value={producto.manualUrl} onChange={handleChange} placeholder="URL del manual" className="w-full border p-2" />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Insertar Producto</button>
    </form>
  );
};

export default FormularioProducto;
