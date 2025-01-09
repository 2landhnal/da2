import { removeVietnameseTones } from './vn.helper.js';

export const nameToPrefix = (fullname) => {
    let words = removeVietnameseTones(fullname);
    words = words.split(' '); // Tách chuỗi thành mảng
    const lastWord = words.pop(); // Lấy phần tử cuối
    const restWords = words.map((word) => word.charAt(0)).join(''); // Lấy ký tự đầu của các từ còn lại
    return `${lastWord}.${restWords}`.toLowerCase(); // Kết hợp lại theo định dạng yêu cầu
};
