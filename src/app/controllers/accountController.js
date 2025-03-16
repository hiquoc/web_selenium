const jwt = require("jsonwebtoken");
const db = require("../config/mysql");
class accountController {
  loginpage(req, res) {
    res.render("account/login", {
      layout: "account",
    });
  }
  async loginPost(req, res) {
    try {
      const { username, password } = req.body;

      const sql = "SELECT password FROM account WHERE username = ?";
      const [results] = await db.query(sql, [username]);

      if (results.length === 0) {
        return res
          .status(401)
          .json({ message: "Sai tài khoản hoặc mật khẩu!" });
      }

      const user = results[0];
      if (password != user.password) {
        return res
          .status(401)
          .json({ message: "Sai tài khoản hoặc mật khẩu!" });
      }

      const token = jwt.sign({ username }, "huy", {
        expiresIn: "1h",
      });

      return res.json({ message: "Đăng nhập thành công!", token });
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
  }

  async getInfo(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Vui lòng đăng nhập" });
    }

    try {
      const decoded = jwt.verify(token, "huy");

      const sql =
        "SELECT account_id, username, fullname, phone, email, role FROM account WHERE username = ?";
      const [rows] = await db.query(sql, [decoded.username]);

      if (rows.length === 0) {
        return res.status(401).json({ message: "Token không hợp lệ" });
      }

      req.user = rows[0];
      res.json({
        username: req.user.username,
        fullname: req.user.fullname,
        phone: req.user.phone,
        email: req.user.email,
        role: req.user.role,
      });
    } catch (error) {
      console.error("Lỗi xác thực token:", error);
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
  }

  logout(req, res) {
    res.redirect("/");
  }
  ////////////////
}
module.exports = new accountController();
