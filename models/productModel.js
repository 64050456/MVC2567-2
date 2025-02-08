const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data', 'products.json');

function getAllProducts() {
  try {
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    return [];
  }
}

function saveAllProducts(products) {
  fs.writeFileSync(dataPath, JSON.stringify(products, null, 2), 'utf-8');
}

module.exports = {
  getAllProducts,
  saveAllProducts
};
