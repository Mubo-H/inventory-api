const fs = require("fs");
const path = require("path");

const itemsFilePath = path.join(__dirname, "../data/items.json");

// Helper function to read the file
const readItemsFile = () => {
  try {
    const data = fs.readFileSync(itemsFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write to the file
const writeItemsFile = (items) => {
  try {
    fs.writeFileSync(itemsFilePath, JSON.stringify(items, null, 2));
  } catch (error) {
    throw new Error("Failed to write to file");
  }
};

// Handle creating a new item
const handleCreateItem = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const newItem = JSON.parse(body);

      if (
        !newItem.name ||
        !newItem.price ||
        !newItem.size ||
        !["s", "m", "l"].includes(newItem.size)
      ) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: "Invalid data" }));
      }

      const items = readItemsFile();
      const newId = items.length ? items[items.length - 1].id + 1 : 1;
      const item = { id: newId, ...newItem };

      items.push(item);
      writeItemsFile(items);

      res.statusCode = 201;
      res.end(JSON.stringify(item));
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Failed to create item" }));
    }
  });
};

// Handle getting all items
const handleGetAllItems = (res) => {
  const items = readItemsFile();
  res.statusCode = 200;
  res.end(JSON.stringify({ items }));
};

// Handle getting a specific item
const handleGetOneItem = (parsedUrl, res) => {
  const id = parseInt(parsedUrl.pathname.split("/").pop(), 10);
  const items = readItemsFile();
  const item = items.find((i) => i.id === id);

  if (!item) {
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: "Item not found" }));
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ item }));
};

// Handle updating an item
const handleUpdateItem = (req, parsedUrl, res) => {
  let body = "";
  const id = parseInt(parsedUrl.pathname.split("/").pop(), 10);

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const updatedData = JSON.parse(body);
      const items = readItemsFile();
      const index = items.findIndex((i) => i.id === id);

      if (index === -1) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: "Item not found" }));
      }

      const updatedItem = { ...items[index], ...updatedData };
      items[index] = updatedItem;
      writeItemsFile(items);

      res.statusCode = 200;
      res.end(JSON.stringify({ item: updatedItem }));
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: "Failed to update item" }));
    }
  });
};

// Handle deleting an item
const handleDeleteItem = (parsedUrl, res) => {
  const id = parseInt(parsedUrl.pathname.split("/").pop(), 10);
  const items = readItemsFile();
  const index = items.findIndex((i) => i.id === id);

  if (index === -1) {
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: "Item not found" }));
  }

  items.splice(index, 1);
  writeItemsFile(items);

  res.statusCode = 200;
  res.end(JSON.stringify({ message: "Item deleted successfully" }));
};

module.exports = {
  handleCreateItem,
  handleGetAllItems,
  handleGetOneItem,
  handleUpdateItem,
  handleDeleteItem,
};
