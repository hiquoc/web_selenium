const { Builder, By, Key, until } = require("selenium-webdriver");
const path = require("path");
const assert = require("assert");

const testCase = process.argv[2];

(async function addProduct() {
  let driver = await new Builder().forBrowser("chrome").build();

  try {
    await driver.manage().window().maximize();
    await driver.get("http://localhost:10000/admin/new-product");
    await driver.wait(until.elementLocated(By.name("name")), 10000);

    const runTest = async (id, description, testFunc) => {
      if (!testCase || testCase == id) {
        console.log(`Test ${id}: ${description}`);
        await testFunc();
      }
    };

    // Test Case 1: Không nhập tên sản phẩm
    await runTest(1, "Không nhập tên sản phẩm", async () => {
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    // Test Case 2: Không nhập giá
    await runTest(2, "Không nhập giá", async () => {
      await driver.findElement(By.name("name")).sendKeys("Táo");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("");
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    // Test Case 3: Nhập giá không hợp lệ (chữ)
    await runTest(3, "Nhập giá không hợp lệ", async () => {
      await driver.findElement(By.name("name")).clear();
      await driver.findElement(By.name("name")).sendKeys("Táo");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("abc");
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    // Test Case 4: Nhập giá quá dài
    await runTest(4, "Nhập giá quá dài", async () => {
      await driver.findElement(By.name("name")).clear();
      await driver.findElement(By.name("name")).sendKeys("Táo");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("123456789012");
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    await runTest(5, "Nhập giá âm", async () => {
      await driver.findElement(By.name("name")).clear();
      await driver.findElement(By.name("name")).sendKeys("Táo");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("-50000");
      await driver.findElement(By.css("button[type='submit']")).click();

      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    // Test Case 6: Không chọn danh mục
    await runTest(6, "Không chọn danh mục", async () => {
      await driver.findElement(By.name("name")).clear();
      await driver.findElement(By.name("name")).sendKeys("Táo");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("50000");
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    // Test Case 7: Không nhập số lượng
    await runTest(7, "Không nhập số lượng", async () => {
      await driver.findElement(By.name("name")).clear();
      await driver.findElement(By.name("name")).sendKeys("Táo đỏ Mỹ (1kg)");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("150000");
      let category = await driver.findElement(By.name("category"));
      await category.click();
      await category.sendKeys(Key.ARROW_DOWN);
      await category.sendKeys(Key.ENTER);
      await driver.findElement(By.name("stock")).sendKeys("");
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    // Test Case 8: Nhập số lượng âm
    await runTest(8, "Nhập số lượng âm", async () => {
      await driver.findElement(By.name("name")).clear();
      await driver.findElement(By.name("name")).sendKeys("Táo đỏ Mỹ (1kg)");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("150000");
      let category = await driver.findElement(By.name("category"));
      await category.click();
      await category.sendKeys(Key.UP);
      await category.sendKeys(Key.ARROW_DOWN);
      await category.sendKeys(Key.ENTER);
      await driver.findElement(By.name("stock")).clear();
      await driver.findElement(By.name("stock")).sendKeys("-10");
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    // Test Case 9: Nhập số lượng quá dài
    await runTest(9, "Nhập số lượng quá dài", async () => {
      await driver.findElement(By.name("name")).clear();
      await driver.findElement(By.name("name")).sendKeys("Táo đỏ Mỹ (1kg)");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("150000");
      let category = await driver.findElement(By.name("category"));
      await category.click();
      await category.sendKeys(Key.UP);
      await category.sendKeys(Key.ARROW_DOWN);
      await category.sendKeys(Key.ENTER);
      await driver.findElement(By.name("stock")).clear();
      await driver.findElement(By.name("stock")).sendKeys("999999999999");
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    // Test Case 10: Không chọn trạng thái
    await runTest(10, "Không chọn trạng thái", async () => {
      await driver.findElement(By.name("name")).clear();
      await driver.findElement(By.name("name")).sendKeys("Táo đỏ Mỹ (1kg)");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("150000");
      let category = await driver.findElement(By.name("category"));
      await category.click();
      await category.sendKeys(Key.UP);
      await category.sendKeys(Key.ARROW_DOWN);
      await category.sendKeys(Key.ENTER);
      await driver.findElement(By.name("stock")).clear();
      await driver.findElement(By.name("stock")).sendKeys("1000");
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    // Test Case 11: Không nhập mô tả sản phẩm
    await runTest(11, "Không nhập mô tả sản phẩm", async () => {
      await driver.findElement(By.name("name")).clear();
      await driver.findElement(By.name("name")).sendKeys("Táo đỏ Mỹ (1kg)");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("150000");
      let category = await driver.findElement(By.name("category"));
      await category.click();
      await category.sendKeys(Key.UP);
      await category.sendKeys(Key.ARROW_DOWN);
      await category.sendKeys(Key.ENTER);
      await driver.findElement(By.name("stock")).clear();
      await driver.findElement(By.name("stock")).sendKeys("1000");
      let status = await driver.findElement(By.name("status"));
      await status.click();
      await status.sendKeys(Key.UP);
      await status.sendKeys(Key.ARROW_DOWN);
      await status.sendKeys(Key.ENTER);
      await driver.findElement(By.name("details")).clear();
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    // Test Case 12: Không chọn ảnh chính
    await runTest(12, "Không chọn ảnh chính", async () => {
      await driver.findElement(By.name("name")).clear();
      await driver.findElement(By.name("name")).sendKeys("Táo đỏ Mỹ (1kg)");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("150000");
      let category = await driver.findElement(By.name("category"));
      await category.click();
      await category.sendKeys(Key.UP);
      await category.sendKeys(Key.ARROW_DOWN);
      await category.sendKeys(Key.ENTER);
      await driver.findElement(By.name("stock")).clear();
      await driver.findElement(By.name("stock")).sendKeys("1000");
      let status = await driver.findElement(By.name("status"));
      await status.click();
      await status.sendKeys(Key.UP);
      await status.sendKeys(Key.ARROW_DOWN);
      await status.sendKeys(Key.ENTER);
      await driver.findElement(By.name("details")).clear();
      await driver
        .findElement(By.name("details"))
        .sendKeys("Táo đỏ nhập khẩu từ Mỹ.");
      await driver.findElement(By.css("button[type='submit']")).click();
      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });
    // Test Case 13: Không upload file ảnh đúng định dạng
    await runTest(13, "Không upload file ảnh đúng định dạng", async () => {
      let imagePaths = ["chromedriver.exe"].map((img) => path.resolve(img));
      let upload = await driver.findElement(By.id("product-images"));
      for (let imgPath of imagePaths) {
        await upload.sendKeys(imgPath);
      }
      await driver.sleep(1000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    // Test Case 14: Nhập tên sản phẩm bị trùng
    await runTest(14, "Nhập tên sản phẩm bị trùng", async () => {
      await driver.findElement(By.name("name")).clear();
      await driver.findElement(By.name("name")).sendKeys("Táo đỏ Mỹ (1kg)");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("150000");
      let category = await driver.findElement(By.name("category"));
      await category.click();
      await category.sendKeys(Key.UP);
      await category.sendKeys(Key.ARROW_DOWN);
      await category.sendKeys(Key.ENTER);
      await driver.findElement(By.name("stock")).clear();
      await driver.findElement(By.name("stock")).sendKeys("1000");
      let status = await driver.findElement(By.name("status"));
      await status.click();
      await status.sendKeys(Key.UP);
      await status.sendKeys(Key.ARROW_DOWN);
      await status.sendKeys(Key.ENTER);
      await driver
        .findElement(By.name("details"))
        .sendKeys("Táo đỏ nhập khẩu từ Mỹ.");

      let imagePaths = ["img1.webp", "img2.webp"].map((img) =>
        path.resolve(img)
      );
      await driver.findElement(By.id("product-images")).clear();
      let upload = await driver.findElement(By.id("product-images"));
      for (let imgPath of imagePaths) {
        await upload.sendKeys(imgPath);
      }
      let firstImage = await driver.findElement(By.css(".small-img"));
      await driver.executeScript("arguments[0].scrollIntoView();", firstImage);
      await driver.sleep(1000);
      await firstImage.click();

      await driver.sleep(1000);
      let submitButton = await driver.findElement(
        By.css("button[type='submit']")
      );

      // Cuộn đến nút submit trước khi nhấn
      await driver.executeScript(
        "arguments[0].scrollIntoView();",
        submitButton
      );
      await driver.sleep(1000);
      await submitButton.click();
      await driver.sleep(2000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Lỗi hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });

    // Test Case 15: Nhập thông tin hợp lệ và gửi thành công
    await runTest(15, "Nhập thông tin hợp lệ", async () => {
      await driver.executeScript("window.scrollTo(0, 0);");
      await driver.sleep(1000);
      await driver.findElement(By.name("name")).clear();
      await driver.findElement(By.name("name")).sendKeys("Táo đỏ Mỹ (1kg) test");
      await driver.findElement(By.name("price")).clear();
      await driver.findElement(By.name("price")).sendKeys("150000");
      let category = await driver.findElement(By.name("category"));
      await category.click();
      await category.sendKeys(Key.UP);
      await category.sendKeys(Key.ARROW_DOWN);
      await category.sendKeys(Key.ENTER);
      await driver.findElement(By.name("stock")).clear();
      await driver.findElement(By.name("stock")).sendKeys("1000");
      let status = await driver.findElement(By.name("status"));
      await status.click();
      await status.sendKeys(Key.UP);
      await status.sendKeys(Key.ARROW_DOWN);
      await status.sendKeys(Key.ENTER);
      await driver.findElement(By.name("details")).clear();
      await driver
        .findElement(By.name("details"))
        .sendKeys("Táo đỏ nhập khẩu từ Mỹ.");

      let imagePaths = ["img1.webp", "img2.webp"].map((img) =>
        path.resolve(img)
      );
      await driver.findElement(By.id("product-images")).clear();
      let upload = await driver.findElement(By.id("product-images"));
      for (let imgPath of imagePaths) {
        await upload.sendKeys(imgPath);
      }
      let firstImage = await driver.findElement(By.css(".small-img"));
      await driver.executeScript("arguments[0].scrollIntoView();", firstImage);
      await driver.sleep(1000);
      await firstImage.click();

      await driver.sleep(2000);
      let submitButton = await driver.findElement(
        By.css("button[type='submit']")
      );

      // Cuộn đến nút submit trước khi nhấn
      await driver.executeScript(
        "arguments[0].scrollIntoView();",
        submitButton
      );
      await driver.sleep(1000);
      await submitButton.click();
      await driver.sleep(1000);
      let alertElement = await driver.findElements(By.id("alert-text"));
      let errorMsg = await alertElement[0].getText();
      console.log("Hiển thị:", errorMsg);
      let closeButton = await driver.findElement(By.css(".closexxx"));
      await closeButton.click();
      await driver.sleep(1000);
    });
  } catch (error) {
    console.error("Lỗi xảy ra:", error);
  } finally {
    await driver.quit();
  }
})();
