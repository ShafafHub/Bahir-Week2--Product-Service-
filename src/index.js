const http = require("http");
const { validateProduct } = require("./lib/validate");
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

  // Get Single Product
  if (url.startsWith("/products/") && method === "GET") {
    const id = url.split("/")[2];
    const product = findById(id);
    if (!product) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: "Product not found" }));
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
        // استفاده از فایل ولیدیشن
        if (!validateProduct(data)) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: "Invalid product data" }));
        }
        const newProduct = createProduct(data);
        res.statusCode = 201;
        res.end(JSON.stringify(newProduct));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid JSON format" }));
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
      try {
        const updated = updateProduct(id, JSON.parse(body));
        if (!updated) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: "Product not found" }));
        }
        res.statusCode = 200;
        res.end(JSON.stringify(updated));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
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
    return res.end(JSON.stringify({ error: "Product not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
