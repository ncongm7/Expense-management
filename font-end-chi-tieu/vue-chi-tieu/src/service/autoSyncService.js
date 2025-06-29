/**
 * Giả lập: Lắng nghe email mới về, regex nội dung, tự động phân loại giao dịch và trả về object giao dịch phù hợp.
 * Không tích hợp vào app, chỉ là logic thuần.
 */

class AutoSyncService {
    constructor() {
        this.isSyncing = false;
        this.listeners = [];
    }

    // Bật đồng bộ tự động
    startAutoSync() {
        this.isSyncing = true;
        // Giả lập: Bắt đầu lắng nghe email (ở đây chỉ là setInterval demo)
        this.mockEmailListener();
    }

    // Tắt đồng bộ tự động
    stopAutoSync() {
        this.isSyncing = false;
        // Dừng lắng nghe email (nếu có)
        clearInterval(this._mockInterval);
    }

    // Đăng ký callback khi có giao dịch mới
    onNewTransaction(callback) {
        this.listeners.push(callback);
    }

    // Giả lập: Lắng nghe email mới về
    mockEmailListener() {
        // Demo: mỗi 10s sẽ giả lập có 1 email chuyển khoản về
        this._mockInterval = setInterval(() => {
            if (!this.isSyncing) return;
            const email = this.mockBankEmail();
            const transaction = this.parseBankEmail(email.subject, email.body);
            if (transaction) {
                this.listeners.forEach(cb => cb(transaction));
            }
        }, 10000);
    }

    // Giả lập: Tạo email chuyển khoản ngẫu nhiên
    mockBankEmail() {
        const amount = Math.floor(Math.random() * 1000000) + 100000;
        const content = [
            `TK 123456789 vua nhan +${amount} VND tu NGUYEN VAN A. Noi dung: LUONG THANG 6`,
            `TK 123456789 vua nhan +${amount} VND tu NGUYEN VAN B. Noi dung: CHUYEN KHOAN TIET KIEM`,
            `TK 123456789 vua nhan +${amount} VND tu NGUYEN VAN C. Noi dung: CHI TIEU AN UONG`
        ];
        const idx = Math.floor(Math.random() * content.length);
        return {
            subject: "Thong bao giao dich ngan hang",
            body: content[idx]
        };
    }

    // Regex nội dung email để phân loại giao dịch
    parseBankEmail(subject, body) {
        // Ví dụ: "TK 123456789 vua nhan +500000 VND tu NGUYEN VAN A. Noi dung: LUONG THANG 6"
        const match = body.match(/nhan \\+([\\d,]+) VND.*Noi dung: (.+)/i);
        if (!match) return null;
        const amount = parseInt(match[1].replace(/,/g, ''), 10);
        const note = match[2].trim();

        // Phân loại hũ dựa vào nội dung
        let jarType = 'Khác';
        if (/luong|lương|salary/i.test(note)) jarType = 'Hũ Nhu Cầu Thiết Yếu';
        else if (/tiet kiem|tiết kiệm|save/i.test(note)) jarType = 'Hũ Tiết Kiệm';
        else if (/dau tu|đầu tư|invest/i.test(note)) jarType = 'Hũ Đầu Tư';
        else if (/chi tieu|chi tiêu|spend|an uong|ăn uống/i.test(note)) jarType = 'Hũ Chi Tiêu Cá Nhân';

        return {
            amount,
            note,
            jarType,
            createdAt: new Date().toISOString()
        };
    }
}

export default new AutoSyncService();
