from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os

options = webdriver.ChromeOptions()
options.add_argument("--start-maximized") 

driver = webdriver.Chrome(options=options) 
driver.get("http://localhost:10000/admin/new-product")

# Chờ trang tải xong
wait = WebDriverWait(driver, 10)

# Nhập dữ liệu
driver.find_element(By.NAME, "name").send_keys("Trai cay 1 (500g)")
driver.find_element(By.NAME, "price").send_keys("25000090000000")
driver.find_element(By.NAME, "stock").send_keys("asd")
driver.find_element(By.NAME, "details").send_keys("Trai cay thom ngon.")

# Chọn danh mục 
category = driver.find_element(By.NAME, "category")
category.click()
category.send_keys(Keys.ARROW_DOWN)  # Chọn option đầu tiên
category.send_keys(Keys.ENTER)

# Chọn trạng thái
status = driver.find_element(By.NAME, "status")
status.click()
status.send_keys(Keys.ARROW_DOWN)  # Chọn "Còn hàng"
status.send_keys(Keys.ENTER)

# Tải lên hình ảnh
image_path_1 = os.path.abspath("img1.webp")
image_path_2 = os.path.abspath("img2.webp")
upload = driver.find_element(By.ID, "product-images")
upload.send_keys(f"{image_path_1}\n{image_path_2}")

time.sleep(1)  # Chờ xử lý hình ảnh

# Chọn ảnh đầu tiên làm ảnh chính
first_image = driver.find_element(By.CSS_SELECTOR, ".small-img")
driver.execute_script("arguments[0].scrollIntoView();", first_image)
time.sleep(1) 
first_image.click()


# Gửi form
submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
submit_button.click()

# Chờ phản hồi từ server
try:
    alert_text_element = wait.until(
    EC.visibility_of_element_located((By.ID, "alert-text")))
    print("Thông báo từ server:", alert_text_element.text)

except:
    print("Không nhận được phản hồi từ server!")

input("Nhấn Enter để đóng trình duyệt...")
# Đóng trình duyệt
# driver.quit()
