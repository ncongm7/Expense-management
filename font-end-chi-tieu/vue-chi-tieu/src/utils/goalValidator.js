export function validateGoal(goal) {
    if (!goal.name || !goal.amount || !goal.startDate || !goal.endDate) {
        return { valid: false, message: 'Vui lòng nhập đầy đủ thông tin!' };
    }
    if (goal.amount < 1000) {
        return { valid: false, message: 'Số tiền mục tiêu phải lớn hơn 1000!' };
    }
    if (goal.saved > goal.amount) {
        return { valid: false, message: 'Số tiền đã tiết kiệm không được lớn hơn mục tiêu!' };
    }
    if (goal.startDate > goal.endDate) {
        return { valid: false, message: 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc!' };
    }
    return { valid: true };
} 