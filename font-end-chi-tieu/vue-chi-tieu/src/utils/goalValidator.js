export function validateGoal(goal) {
    if (!goal.title || !goal.targetAmount || !goal.createdAt || !goal.deadline) {
        return { valid: false, message: 'Vui lòng nhập đầy đủ thông tin!' };
    }
    if (goal.targetAmount < 1000) {
        return { valid: false, message: 'Số tiền mục tiêu phải lớn hơn 1000!' };
    }
    if (goal.currentAmount > goal.targetAmount) {
        return { valid: false, message: 'Số tiền đã tiết kiệm không được lớn hơn mục tiêu!' };
    }
    if (goal.createdAt > goal.deadline) {
        return { valid: false, message: 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc!' };
    }
    return { valid: true };
} 