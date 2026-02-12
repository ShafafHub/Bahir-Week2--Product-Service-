// src/lib/store.js

let products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Phone", price: 2000 },
];

const listProducts = () => {
  return products;
};

const findById = (id) => {
  //
  return products.find((p) => p.id === Number(id));
};

const createProduct = (data) => {
  const newProduct = {
    //
    id: data.id ? Number(data.id) : products.length + 1,
    name: data.name,
    price: data.price,
  };
  products.push(newProduct);
  return newProduct;
};

const updateProduct = (id, data) => {
  const index = products.findIndex((p) => p.id === Number(id));
  if (index !== -1) {
    products[index] = { ...products[index], ...data };
    return products[index];
  }
  return null;
};

const deleteProduct = (id) => {
  const index = products.findIndex((p) => p.id === Number(id));
  if (index !== -1) {
    products.splice(index, 1);
    return true;
  }
  return false;
};

module.exports = {
  listProducts,
  findById,
  createProduct,
  updateProduct,
  deleteProduct,
};
