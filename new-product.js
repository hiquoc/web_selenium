const { Builder, By, Key, until } = require("selenium-webdriver");
const path = require("path");

(async function addProduct() {
  // Khởi tạo trình duyệt Chrome
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    // Điều hướng đến trang quản trị thêm sản phẩm
    await driver.manage().window().maximize();
    await driver.get("http://localhost:10000/admin/new-product");

    // Chờ trang tải xong
    let wait = driver.wait(until.elementLocated(By.name("name")), 10000);

    // Nhập dữ liệu vào các ô input
    await driver.findElement(By.name("name")).sendKeys("Trai cay 1 (500g)");
    await driver.findElement(By.name("price")).sendKeys("25000");
    await driver.findElement(By.name("stock")).sendKeys("100");
    await driver.findElement(By.name("details")).sendKeys("Trai cay thom ngon.");

    // Chọn danh mục
    let category = await driver.findElement(By.name("category"));
    await category.click();
    await category.sendKeys(Key.ARROW_DOWN); // Chọn option đầu tiên
    await category.sendKeys(Key.ENTER);

    // Chọn trạng thái
    let status = await driver.findElement(By.name("status"));
    await status.click();
    await status.sendKeys(Key.ARROW_DOWN); // Chọn "Còn hàng"
    await status.sendKeys(Key.ENTER);

    // Tải lên hình ảnh
    let imagePath1 = path.resolve("img1.webp");
    let imagePath2 = path.resolve("img2.webp");
    let upload = await driver.findElement(By.id("product-images"));
    await upload.sendKeys(`${imagePath1}\n${imagePath2}`);

    await driver.sleep(1000); // Chờ xử lý hình ảnh

    // Chọn ảnh đầu tiên làm ảnh chính
    let firstImage = await driver.findElement(By.css(".small-img"));
    await driver.executeScript("arguments[0].scrollIntoView();", firstImage);
    await driver.sleep(1000);
    await firstImage.click();

    // Gửi form
    let submitButton = await driver.findElement(By.css("button[type='submit']"));
    await submitButton.click();

    // Chờ phản hồi từ server
    try {
      let alertTextElement = await driver.wait(
        until.elementLocated(By.id("alert-text")),
        5000
      );
      let alertText = await alertTextElement.getText();
      console.log("Thông báo từ server:", alertText);
    } catch (error) {
      console.log("Không nhận được phản hồi từ server!");
    }

    // Giữ trình duyệt mở để kiểm tra kết quả
    // console.log("Nhấn Enter để đóng trình duyệt...");
    process.stdin.resume();

  } catch (error) {
    console.error("Lỗi xảy ra:", error);
  }
})();
