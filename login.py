from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Khởi tạo trình duyệt (Chrome)
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)
driver.get("http://localhost:10000/account/login")  # Điều hướng đến trang đăng nhập

# Chờ trang tải xong
wait = WebDriverWait(driver, 10)

# Nhập tài khoản và mật khẩu
driver.find_element(By.NAME, "username").send_keys("huy1")
driver.find_element(By.NAME, "password").send_keys("1234567") 

# Nhấn Đăng nhập
submit_button = driver.find_element(By.ID, "submit-btn")
submit_button.click()

# Chờ phản hồi từ server
try:
    alert_element = wait.until(EC.visibility_of_element_located((By.ID, "alert-text")))
    print("Thông báo từ server:", alert_element.text)

except:
    print("Không nhận được phản hồi từ server hoặc đăng nhập thất bại!")

# Đợi 3 giây để xem kết quả trước khi đóng trình duyệt
time.sleep(3)

# Đóng trình duyệt
driver.quit()
