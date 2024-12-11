console.log(require('crypto').randomBytes(8).toString('hex'));

function transformString(input) {
    const words = input.split(' '); // Tách chuỗi thành mảng
    const lastWord = words.pop(); // Lấy phần tử cuối
    const restWords = words.map((word) => word.charAt(0)).join(''); // Lấy ký tự đầu của các từ còn lại
    return `${lastWord}.${restWords}`; // Kết hợp lại theo định dạng yêu cầu
}

// Ví dụ sử dụng
const input = 'axx bxxx cxxx mxxx nxxx';
const result = transformString(input);
console.log(result); // "nxxx.abc...m"
