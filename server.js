const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const {
  handleCreateItem,
  handleGetAllItems,
  handleGetOneItem,
  handleUpdateItem,
  handleDeleteItem,
} = require("./utils/inventory");

const PORT = 3000;

const server = http.createServer((req, res) => {
  const { method, url: reqUrl } = req;
  const parsedUrl = url.parse(reqUrl, true);
  const pathname = parsedUrl.pathname;

  // Set CORS header for cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  if (method === "OPTIONS") {
    return res.end();
  }

  // Example API Requests (as Documentation)
  // 1. **Create a new item** (POST to `/api/items`)
  //    Request Body:
  //    {
  //        "name": "Shirt",
  //        "price": 20.5,
  //        "size": "m"
  //    }
  //
  // 2. **Get all items** (GET to `/api/items`)
  //    Response:
  //    {
  //        "items": [
  //            {
  //                "id": 1,
  //                "name": "Shirt",
  //                "price": 20.5,
  //                "size": "m"
  //            }
  //        ]
  //    }
  //
  // 3. **Get one item** (GET to `/api/items/1`)
  //    Response:
  //    {
  //        "item": {
  //            "id": 1,
  //            "name": "Shirt",
  //            "price": 20.5,
  //            "size": "m"
  //        }
  //    }
  //
  // 4. **Update an item** (PUT to `/api/items/1`)
  //    Request Body:
  //    {
  //        "price": 25.0
  //    }
  //
  // 5. **Delete an item** (DELETE to `/api/items/1`)
  //    Response:
  //    {
  //        "message": "Item deleted successfully"
  //    }

  // Routes for different API operations
  if (pathname === "/api/items" && method === "GET") {
    handleGetAllItems(res);
  } else if (pathname === "/api/items" && method === "POST") {
    handleCreateItem(req, res);
  } else if (pathname.match(/^\/api\/items\/\d+$/) && method === "GET") {
    handleGetOneItem(parsedUrl, res);
  } else if (pathname.match(/^\/api\/items\/\d+$/) && method === "PUT") {
    handleUpdateItem(req, parsedUrl, res);
  } else if (pathname.match(/^\/api\/items\/\d+$/) && method === "DELETE") {
    handleDeleteItem(parsedUrl, res);
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
