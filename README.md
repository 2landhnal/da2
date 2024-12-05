# Hướng Dẫn Sử Dụng

## 1. Lưu Ý

## 2. Cấu Trúc Dự Án

-   **`frontEnd/`**: Chứa toàn bộ mã nguồn front-end, tất cả những gì liên quan đến front-end quăng vào đây.
-   **`aService/`, `bService/`**: Là các service riêng lẻ thuộc back-end. Khi chạy dự án cần khởi động tất cả các service này.

## 3. Hướng Dẫn Chạy Server

1.  Chạy "cd tên_server_here"
2.  Tạo file .env trong folder tên_server_here
3.  Thêm các biến vào file .env. Ví dụ:

    DB_URL=url_here

    PORT=3002

    REFRESH_TOKEN="abc"

    SECRET_TOKEN_KEY="xyz"

4.  Các file .env sẽ được cung cấp trên doc
5.  Chạy "npm i" // tải các package cần thiết
6.  Chạy "npm start" // chạy server
