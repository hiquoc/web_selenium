const axios = require("axios");
const db = require("../config/mysql");
class accountController {
  async main(req, res) {
    try {
      const { data: hots } = await axios.get(`http://localhost:10000/top`);
      const topFive = hots.slice(0, 5);
      
      res.render("home", { hots: topFive});
    } catch (e) {
      console.error("Lỗi khi lấy sản phẩm");
      res.status(500).json({ message: "Lỗi server" });
    }
  }

  async categories(req, res) {
    try {
      const CateSql = "SELECT * FROM category";
      let [categories] = await db.query(CateSql);

      return res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server!" });
    }
  }
  async top(req, res) {
    try {
      const topProSql =
        "SELECT * FROM product WHERE status='con-hang' ORDER BY sold";
      const [products] = await db.query(topProSql);

      const ImgSql = "SELECT * FROM product_image";
      let [images] = await db.query(ImgSql);

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
      }));
      return res.status(200).json(Products);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Lỗi server!" });
    }
  }
  async product(req, res) {
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
      console.log(Products)
      res.render("product",{product: Products[0]})
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server!" });
    }
  }
}
module.exports = new accountController();
