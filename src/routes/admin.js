const express = require("express");
const router = express.Router();
let adminController = require("../app/controllers/adminController");
let upload = require("../app/config/multer");
router.get("/new-product", adminController.newProduct);
router.get("/product/:product_id", adminController.editProduct);
router.get("/product", adminController.product);
router.delete("/xoa/:product_id", adminController.xoa);
router.post(
  "/new-product",
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "mainImage", maxCount: 1 },
  ]),
  adminController.upload //dang san pham moi
);
//sua thong tin san pham
router.patch(
  "/edit1/:product_id",
  upload.fields([
    { name: "images", maxCount: 4 },
    { name: "mainImage", maxCount: 1 },
  ]),
  adminController.edit1
);
router.patch("/edit2/:product_id", upload.none(), adminController.edit2);

module.exports = router;
