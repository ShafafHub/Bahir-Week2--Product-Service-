// src/index.js
const http = require("http");
const {
  listProducts,
  findById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./lib/store");

const server = http.createServer((req, res) => {
  const { method, url } = req;
  res.setHeader("Content-Type", "application/json");

  // Health Check
  if (url === "/health" && method === "GET") {
    res.statusCode = 200;
    return res.end(JSON.stringify({ status: "ok" }));
  }

  // List Products
  if (url === "/products" && method === "GET") {
    res.statusCode = 200;
    return res.end(JSON.stringify(listProducts()));
  }

  // Get Single Product /products/:id
  if (url.startsWith("/products/") && method === "GET") {
    const id = url.split("/")[2];
    const product = findById(id);
    if (!product) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: "Product is not found" }));
    }
    res.statusCode = 200;
    return res.end(JSON.stringify(product));
  }

  // Create Product (POST)
  if (url === "/products" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        if (!data.name || data.price === undefined || data.price < 0) {
          res.statusCode = 400;
          return res.end(
            JSON.stringify({ error: "product name is not found " }),
          );
        }
        const newProduct = createProduct(data);
        res.statusCode = 201;
        res.end(JSON.stringify(newProduct));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "the product is created" }));
      }
    });
    return;
  }

  // Update Product (PUT)
  if (url.startsWith("/products/") && method === "PUT") {
    const id = url.split("/")[2];
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));
    req.on("end", () => {
      const updated = updateProduct(id, JSON.parse(body));
      if (!updated) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: "pruduct is puted " }));
      }
      res.statusCode = 200;
      res.end(JSON.stringify(updated));
    });
    return;
  }

  // Delete Product (DELETE)
  if (url.startsWith("/products/") && method === "DELETE") {
    const id = url.split("/")[2];
    if (deleteProduct(id)) {
      res.statusCode = 204;
      return res.end();
    }
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: "product Deleted successfully " }));
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
