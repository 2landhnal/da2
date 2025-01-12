# Sử dụng một image Node.js cơ bản
FROM node:20

# Tạo thư mục ứng dụng trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependency
RUN npm install

# Sao chép toàn bộ mã nguồn của ứng dụng vào container
COPY . .

# Mở port nếu dịch vụ cần
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]
