/**
 * Utility functions để xử lý định dạng tiền tệ Việt Nam
 */

/**
 * Format số thành định dạng tiền tệ Việt Nam
 * @param {number|string} amount - Số tiền cần format
 * @param {boolean} showSymbol - Có hiển thị ký hiệu tiền tệ không (mặc định: true)
 * @returns {string} Số tiền đã format
 * @example
 * formatCurrency(1234567) // "1.234.567 ₫"
 * formatCurrency(1234567, false) // "1.234.567"
 */
export function formatCurrency(amount, showSymbol = true) {
    if (amount === null || amount === undefined || amount === '') {
        return showSymbol ? '0 ₫' : '0';
    }

    // Chuyển về number nếu là string
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(num)) {
        return showSymbol ? '0 ₫' : '0';
    }

    // Format với dấu phẩy ngăn cách hàng nghìn
    const formatted = num.toLocaleString('vi-VN');

    return showSymbol ? `${formatted} ₫` : formatted;
}

/**
 * Format số thành định dạng tiền tệ Việt Nam với đơn vị
 * @param {number|string} amount - Số tiền cần format
 * @param {string} unit - Đơn vị tiền tệ (mặc định: '₫')
 * @returns {string} Số tiền đã format với đơn vị
 * @example
 * formatCurrencyWithUnit(1234567) // "1.234.567 ₫"
 * formatCurrencyWithUnit(1234567, 'VND') // "1.234.567 VND"
 */
export function formatCurrencyWithUnit(amount, unit = '₫') {
    if (amount === null || amount === undefined || amount === '') {
        return `0 ${unit}`;
    }

    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(num)) {
        return `0 ${unit}`;
    }

    const formatted = num.toLocaleString('vi-VN');
    return `${formatted} ${unit}`;
}

/**
 * Parse string tiền tệ về number
 * @param {string} currencyString - String tiền tệ (VD: "1.234.567 ₫")
 * @returns {number} Số tiền dạng number
 * @example
 * parseCurrency("1.234.567 ₫") // 1234567
 * parseCurrency("1,234,567") // 1234567
 */
export function parseCurrency(currencyString) {
    if (!currencyString || typeof currencyString !== 'string') {
        return 0;
    }

    // Loại bỏ ký hiệu tiền tệ và khoảng trắng
    const cleaned = currencyString.replace(/[₫VND\s]/g, '');

    // Thay thế dấu phẩy bằng dấu chấm (nếu có)
    const normalized = cleaned.replace(/\./g, '').replace(/,/g, '.');

    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format input value cho input field (loại bỏ ký hiệu tiền tệ)
 * @param {number|string} amount - Số tiền
 * @returns {string} Giá trị phù hợp cho input field
 * @example
 * formatInputValue(1234567) // "1234567"
 */
export function formatInputValue(amount) {
    if (amount === null || amount === undefined || amount === '') {
        return '';
    }

    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(num)) {
        return '';
    }

    return num.toString();
}

/**
 * Format số thành định dạng ngắn gọn (K, M, B)
 * @param {number|string} amount - Số tiền
 * @param {boolean} showSymbol - Có hiển thị ký hiệu tiền tệ không
 * @returns {string} Số tiền đã format ngắn gọn
 * @example
 * formatCompactCurrency(1234567) // "1.2M ₫"
 * formatCompactCurrency(1234) // "1.2K ₫"
 */
export function formatCompactCurrency(amount, showSymbol = true) {
    if (amount === null || amount === undefined || amount === '') {
        return showSymbol ? '0 ₫' : '0';
    }

    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(num)) {
        return showSymbol ? '0 ₫' : '0';
    }

    let formatted;
    if (num >= 1000000000) {
        formatted = (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
        formatted = (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        formatted = (num / 1000).toFixed(1) + 'K';
    } else {
        formatted = num.toString();
    }

    return showSymbol ? `${formatted} ₫` : formatted;
}

/**
 * Format số thành định dạng phần trăm
 * @param {number|string} value - Giá trị cần format
 * @param {number} decimals - Số chữ số thập phân (mặc định: 1)
 * @returns {string} Giá trị đã format thành phần trăm
 * @example
 * formatPercentage(0.1234) // "12.3%"
 * formatPercentage(0.1234, 2) // "12.34%"
 */
export function formatPercentage(value, decimals = 1) {
    if (value === null || value === undefined || value === '') {
        return '0%';
    }

    const num = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(num)) {
        return '0%';
    }

    return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * Validate input tiền tệ
 * @param {string} value - Giá trị input
 * @returns {boolean} True nếu hợp lệ
 */
export function validateCurrencyInput(value) {
    if (!value) return true; // Cho phép empty

    // Chỉ cho phép số, dấu chấm, dấu phẩy
    const regex = /^[0-9.,]*$/;
    return regex.test(value);
}

/**
 * Auto format khi user nhập vào input field
 * @param {string} value - Giá trị input
 * @returns {string} Giá trị đã format
 */
export function autoFormatInput(value) {
    if (!value) return '';

    // Loại bỏ tất cả ký tự không phải số
    const numbersOnly = value.replace(/[^0-9]/g, '');

    if (!numbersOnly) return '';

    // Chuyển về number và format
    const num = parseInt(numbersOnly);
    return num.toLocaleString('vi-VN');
}

// Export default object chứa tất cả functions
export default {
    formatCurrency,
    formatCurrencyWithUnit,
    parseCurrency,
    formatInputValue,
    formatCompactCurrency,
    formatPercentage,
    validateCurrencyInput,
    autoFormatInput
}; 