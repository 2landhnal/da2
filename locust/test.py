from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    # Link trang web cần test tải (base URL)
    host = "https://api.nguyencao.site/class/v1/api"  # Thay bằng link trang web của bạn
    
    # Khoảng thời gian chờ ngẫu nhiên giữa các nhiệm vụ (tính bằng giây)
    wait_time = between(1, 3)

    @task(1)
    def load_home_page(self):
        """Kiểm tra tải trang chủ."""
        self.client.get("/search?query=%7B%22semesterId%22%3A%2220253%22%7D")

    @task(1)
    def load_home_page(self):
        """Kiểm tra tải trang chủ."""
        self.client.get("/openCourses/semester/20253")

    # @task(2)
    # def submit_form(self):
    #     """Kiểm tra gửi yêu cầu POST."""
    #     payload = {
    #         "username": "testuser",
    #         "password": "password123"
    #     }
    #     self.client.post("/login", json=payload)

    # @task(3)
    # def browse_items(self):
    #     """Duyệt qua danh sách các mục."""
    #     response = self.client.get("/items")
    #     if response.status_code == 200:
    #         items = response.json()
    #         if items:
    #             # Lấy chi tiết của một mục đầu tiên
    #             item_id = items[0]["id"]
    #             self.client.get(f"/items/{item_id}")

    def on_start(self):
        """Thực hiện khi người dùng khởi động."""
        # self.client.post("/login", json={"username": "locustuser", "password": "securepassword"})
