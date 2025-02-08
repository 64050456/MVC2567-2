const productModel = require('../models/productModel');

function validateProductCode(code) { //ใช้ตรวจสอบรหัสสินค้าหกหลักและห้าขึ้นต้นด้วยเลข0
  const regex = /^[1-9]\d{5}$/;
  return regex.test(code);
}

function isExpired(dateString) { เอาไว้ใช้ตรวจสอบวันหมดอายุ
  const today = new Date();
  const expDate = new Date(dateString);
  return expDate < today; 
}

function getIndexPage(req, res) {
  const products = productModel.getAllProducts();
  
  //เอาไว้นับสินค้าแต่ละประเภทค่ะ
  const summaryByType = {};
  products.forEach(p => {
    const type = p.type;
    if (!summaryByType[type]) summaryByType[type] = 0;
    summaryByType[type]++;
  });
  
  res.render('index', { products, summaryByType });
}

function getAddProductPage(req, res) {
  res.render('addProduct', {
    errorMsg: null,
    oldData: null
  });
}

//กำหนดเงื่อนไขในการเพิ่มสินค้า
function postAddProduct(req, res) {
  const { code, type, expiryDate, status } = req.body;
  
//ตรวจสอบรหัสสินค้าว่ามีครบหกหลักแล้วหก็ไม่ขึ้นต้นด้วยศูนย์
  if (!validateProductCode(code)) {
    return res.render('addProduct', {
      errorMsg: "รหัสสินค้าต้องเป็นตัวเลข 6 หลัก และไม่ขึ้นต้นด้วย 0",
      oldData: { code, type, expiryDate, status }
    });
  }

//ตรวจสอบวันหมดอายุของสินค้าประเภทอาหาร
  if ((type === 'food' || type === 'อาหาร') && expiryDate) {
    if (isExpired(expiryDate)) {
      return res.render('addProduct', {
        errorMsg: "สินค้าอาหารหมดอายุแล้ว ไม่สามารถเพิ่มได้",
        oldData: { code, type, expiryDate, status }
      });
    }
  }

  //เช็คเงื่อนไขของสินค้าประเภทอิเลคและเสื้อผ้า
  if (type === 'electronics' || type === 'อิเล็กทรอนิกส์') { //เช็คว่าสินค้าเสียหานมั้ยถ้าเสียหายจะไม่รับสินค้า
    if (status === 'เสียหาย' || status === 'ต้องตรวจสอบเพิ่มเติม') {
      return res.render('addProduct', {
        errorMsg: "สินค้าประเภทอิเล็กทรอนิกส์ จะไม่รับสินค้าเสียหายหรือต้องตรวจสอบเพิ่มเติม",
        oldData: { code, type, expiryDate, status }
      });
    }
  }

  if (type === 'clothes' || type === 'เสื้อผ้า') {
    if (status === 'เสียหาย') {
      return res.render('addProduct', {
        errorMsg: "สินค้าประเภทเสื้อผ้า จะไม่รับสินค้าเสียหาย",
        oldData: { code, type, expiryDate, status }
      });
    }
  }
  
  //เช็คว่าเคยเพิ่มรหัสนี้เข้าสู่ระบบรึป่าว
  const products = productModel.getAllProducts();
  const found = products.find(p => p.code === code);
  if (found) {
    return res.render('addProduct', {
      errorMsg: "มีสินค้าที่มีรหัสนี้แล้วในระบบ",
      oldData: { code, type, expiryDate, status }
    });
  }

  //แอดสินค้าถ้าผ่านเงื่อนไขครบทุกข้อ
  const newProduct = {
    code,
    type,
    expiryDate: expiryDate || null,
    status
  };

  products.push(newProduct);
  productModel.saveAllProducts(products);

  res.redirect('/');
}

module.exports = {
  getIndexPage,
  getAddProductPage,
  postAddProduct
};
