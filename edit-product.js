const { Builder, By, Key, until } = require("selenium-webdriver");
const path = require("path");

(async function editProduct() {
  // Khởi tạo trình duyệt Chrome
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.manage().window().maximize();
    const productId = "19"; // ID của sản phẩm cần chỉnh sửa
    await driver.get(`http://localhost:10000/admin/product/${productId}`);

    // Chờ trang tải xong
    let wait = driver.wait(until.elementLocated(By.name("name")), 10000);

    // Cập nhật tên sản phẩm
    let nameInput = await driver.findElement(By.name("name"));
    await nameInput.clear();
    await nameInput.sendKeys("Trai cay 1 (500g) - Đã chỉnh");

    // Cập nhật giá sản phẩm
    let priceInput = await driver.findElement(By.name("price"));
    await priceInput.clear();
    await priceInput.sendKeys("300000");

    // Chọn danh mục (nếu cần)
    let category = await driver.findElement(By.name("category"));
    await category.click();
    await category.sendKeys(Key.ARROW_UP);
    await category.sendKeys(Key.ENTER);

    // Chọn trạng thái (nếu cần)
    let status = await driver.findElement(By.name("status"));
    await status.click();
    await status.sendKeys(Key.ARROW_UP);
    await status.sendKeys(Key.ENTER);

    // Tùy chọn: Tải lên ảnh mới hoặc giữ ảnh cũ
    let uploadNewImage = true; // Đổi thành false nếu không muốn thay ảnh mới

    if (uploadNewImage) {
      let imagePath1 = path.resolve("img1.webp");
      let imagePath2 = path.resolve("img2.webp");
      let upload = await driver.findElement(By.id("product-images"));
      await upload.sendKeys(`${imagePath1}\n${imagePath2}`);

      await driver.sleep(1000); 

      // Kiểm tra nếu có ảnh thì mới chọn ảnh đầu tiên
      let images = await driver.findElements(By.css(".small-img"));
      if (images.length > 0) {
        let firstImage = images[0];
        await driver.executeScript(
          "arguments[0].scrollIntoView();",
          firstImage
        );
        await driver.sleep(1000);
        await firstImage.click();
      }
    }

    let submitButton = await driver.findElement(
      By.css("button[type='submit']")
    );

    // Cuộn đến nút submit trước khi nhấn
    await driver.executeScript("arguments[0].scrollIntoView();", submitButton);
    await driver.sleep(1000);

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
    console.log("Nhấn Enter để đóng trình duyệt...");
    process.stdin.resume();
  } catch (error) {
    console.error("Lỗi xảy ra:", error);
  }
})();
