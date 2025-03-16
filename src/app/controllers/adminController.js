const axios = require("axios");
const db = require("../config/mysql");
const path = require("path");
const fs = require("fs");
class AccountController {
  newProduct(req, res) {
    res.render("admin/newProduct", { layout: "admin" });
  }
  async product(req, res) {
    try {
      let ProSql = "SELECT product_id,name,price FROM product";
      let conditions = [];

      if (req.query.sort) {
        switch (req.query.sort) {
          case "gio-trai-cay":
            conditions.push("category=1");
            break;
          case "trai-cay":
            conditions.push("category=2");
            break;
          case "rau-cu":
            conditions.push("category=3");
            break;
        }
      }
      if (conditions.length > 0) {
        ProSql += " WHERE " + conditions.join(" AND ");
      }
      ProSql += " ORDER BY product_id DESC";

      let [products] = await db.query(ProSql);

      const ImgSql = "SELECT product_id,image_url FROM product_image";
      let [images] = await db.query(ImgSql);

      const productMap = {};
      images.forEach((image) => {
        const productId = image.product_id;
        if (!productMap[productId]) {
          productMap[productId] = { mainImg: null };
        }

        if (image.image_url.includes("/uploads/main")) {
          productMap[productId].mainImg = image.image_url;
        }
      });

      // Kết hợp sản phẩm với danh sách ảnh và ảnh chính
      const Products = products.map((product) => ({
        ...product,
        mainImg: productMap[product.product_id]?.mainImg || null,
        images: productMap[product.product_id]?.images || [],
      }));
      res.render("admin/product", { product: Products, layout: "admin" });
    } catch (error) {
      console.error(error);
    }
  }
  async editProduct(req, res) {
    const product_id = req.params.product_id;
    try {
      const ProSql = "SELECT * FROM product WHERE product_id =?";
      let [products] = await db.query(ProSql, [product_id]);

      const ImgSql = "SELECT * FROM product_image WHERE product_id =?";
      let [images] = await db.query(ImgSql, [product_id]);

      const productMap = {};
      images.forEach((image) => {
        const productId = image.product_id;
        if (!productMap[productId]) {
          productMap[productId] = { images: [], mainImg: null };
        }

        if (image.image_url.includes("/uploads/main")) {
          productMap[productId].mainImg = image.image_url;
        } else {
          productMap[productId].images.push(image);
        }
      });

      // Kết hợp sản phẩm với danh sách ảnh và ảnh chính
      const Products = products.map((product) => ({
        ...product,
        mainImg: productMap[product.product_id]?.mainImg || null,
        images:
          productMap[product.product_id]?.images.map((img) => img.image_url) ||
          [],
      }));
      res.render(`admin/edit`, { product: Products[0], layout: "admin" });
    } catch (e) {
      console.error("Lỗi khi lấy sản phẩm");
    }
  }

  async upload(req, res) {
    try {
      if (
        !req.files ||
        (req.files["images"] && req.files["images"].length === 0)
      ) {
        return res
          .status(400)
          .json({ message: "Vui lòng tải ít nhất một ảnh!" });
      }
      const { name, price, category, stock, status, details } = req.body;

      const mainImage = req.files["mainImage"]
        ? `/uploads/${req.files["mainImage"][0].filename}`
        : null;

      const uploadedImages = req.files["images"]
        ? req.files["images"].map((file) => `/uploads/${file.filename}`)
        : [];

      // Nếu có ảnh chính, thêm vào danh sách ảnh đầu tiên
      if (mainImage) {
        uploadedImages.unshift(mainImage);
      }

      const newProSql =
        "INSERT INTO product (name, description, price, stock, category,status) VALUES (?, ?, ?, ?, ?,?)";
      const [proResult] = await db.query(newProSql, [
        name,
        details,
        price,
        stock,
        category,
        status,
      ]);
      const productId = proResult.insertId;

      const values = uploadedImages.map((path) => [productId, path]);
      const newImgSql =
        "INSERT INTO product_image (product_id, image_url) VALUES ?";
      await db.query(newImgSql, [values]);

      return res.status(201).json({
        message: "Đăng thành công!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server!" });
    }
  }

  async edit1(req, res) {
    const product_id = req.params.product_id;
    try {
      if (
        !req.files ||
        (req.files["images"] && req.files["images"].length === 0)
      ) {
        return res
          .status(400)
          .json({ message: "Vui lòng tải ít nhất một ảnh!" });
      }
      const { name, price, category, stock, status, details } = req.body;
      const mainImage = req.files["mainImage"]
        ? `/uploads/${req.files["mainImage"][0].filename}`
        : null;

      const uploadedImages = req.files["images"]
        ? req.files["images"].map((file) => `/uploads/${file.filename}`)
        : [];

      // Nếu có ảnh chính, thêm vào danh sách ảnh đầu tiên
      if (mainImage) {
        uploadedImages.unshift(mainImage);
      }

      const updateProSql =
        "UPDATE product SET name=?,description=?,price=?,stock=?,category=?,status=? WHERE product_id=?";
      await db.query(updateProSql, [
        name,
        details,
        price,
        stock,
        category,
        status,
        product_id,
      ]);

      const values = uploadedImages.map((path) => [product_id, path]);

      //Xóa ảnh
      const getOldImagesSql =
        "SELECT image_url FROM product_image WHERE product_id = ?";
      const [oldImages] = await db.query(getOldImagesSql, [product_id]);

      oldImages.forEach((img) => {
        const filePath = path.join(__dirname, "../../", img.image_url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Đã xóa: ${filePath}`);
        } else {
          console.log(`Không tìm thấy ảnh: ${filePath}`);
        }
      });

      const deleteImgSql = "DELETE FROM product_image WHERE product_id=?";
      await db.query(deleteImgSql, [product_id]);

      const newImgSql =
        "INSERT INTO product_image (product_id, image_url) VALUES ?";
      await db.query(newImgSql, [values]);

      return res.status(201).json({
        message: "Cập nhật thành công!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server!" });
    }
  }

  async edit2(req, res) {
    const product_id = req.params.product_id;
    try {
      const { name, price, category, stock, status, details } = req.body;
      const updateProSql =
        "UPDATE product SET name=?,description=?,price=?,stock=?,category=?,status=? WHERE product_id=?";
      await db.query(updateProSql, [
        name,
        details,
        price,
        stock,
        category,
        status,
        product_id,
      ]);

      return res.status(201).json({
        message: "Cập nhật thành công!",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server!" });
    }
  }

  async xoa(req, res) {
    const product_id = req.params.product_id;
    try {
      //Xóa ảnh
      const getImagesSql =
        "SELECT image_url FROM product_image WHERE product_id = ?";
      const [oldImages] = await db.query(getImagesSql, [product_id]);

      oldImages.forEach((img) => {
        const filePath = path.join(__dirname, "../../", img.image_url);
        console.log(filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Đã xóa: ${filePath}`);
        } else {
          console.log(`Không tìm thấy ảnh: ${filePath}`);
        }
      });

      const deleteProSql = "DELETE FROM product WHERE product_id=?";
      await db.query(deleteProSql, [product_id]);
      return res.status(200).json({ message: "Xóa thành công!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server!" });
    }
  }

  async checkAdmin() {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Vui lòng đăng nhập!" });
    }
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Vui lòng đăng nhập!" });
    }

    try {
      const decoded = jwt.verify(token, "huy");

      const sql = "SELECT role FROM account WHERE username = ?";
      const [rows] = await db.promise().query(sql, [decoded.username]);

      if (rows.length === 0) {
        return res.status(401).json({ message: "Token không hợp lệ" });
      }
      if (rows[0].role == "user") {
        return res.status(401).json({ message: "Không có quyền truy cập!" });
      }
      return res.status(200).json({ message: "Cho phép truy cập!" });
    } catch (error) {
      console.error("Lỗi xác thực token:", error);
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
  }
}

module.exports = new AccountController();
