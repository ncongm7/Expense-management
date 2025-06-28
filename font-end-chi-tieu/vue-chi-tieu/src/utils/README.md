# Currency Formatter Utility

File `currencyFormatter.js` cung cấp các function để xử lý định dạng tiền tệ Việt Nam một cách nhất quán trong toàn bộ ứng dụng.

## Các Function Chính

### 1. `formatCurrency(amount, showSymbol = true)`
Format số thành định dạng tiền tệ Việt Nam với dấu phẩy ngăn cách hàng nghìn.

```javascript
import { formatCurrency } from './utils/currencyFormatter.js';

formatCurrency(1234567) // "1.234.567 ₫"
formatCurrency(1234567, false) // "1.234.567"
```

### 2. `formatCurrencyWithUnit(amount, unit = '₫')`
Format số với đơn vị tiền tệ tùy chỉnh.

```javascript
formatCurrencyWithUnit(1234567) // "1.234.567 ₫"
formatCurrencyWithUnit(1234567, 'VND') // "1.234.567 VND"
```

### 3. `parseCurrency(currencyString)`
Chuyển đổi string tiền tệ về number.

```javascript
parseCurrency("1.234.567 ₫") // 1234567
parseCurrency("1,234,567") // 1234567
```

### 4. `formatInputValue(amount)`
Format số cho input field (loại bỏ ký hiệu tiền tệ).

```javascript
formatInputValue(1234567) // "1234567"
```

### 5. `formatCompactCurrency(amount, showSymbol = true)`
Format số thành định dạng ngắn gọn (K, M, B).

```javascript
formatCompactCurrency(1234567) // "1.2M ₫"
formatCompactCurrency(1234) // "1.2K ₫"
```

### 6. `formatPercentage(value, decimals = 1)`
Format số thành phần trăm.

```javascript
formatPercentage(0.1234) // "12.3%"
formatPercentage(0.1234, 2) // "12.34%"
```

### 7. `validateCurrencyInput(value)`
Validate input tiền tệ (chỉ cho phép số, dấu chấm, dấu phẩy).

```javascript
validateCurrencyInput("123,456") // true
validateCurrencyInput("abc") // false
```

### 8. `autoFormatInput(value)`
Auto format khi user nhập vào input field.

```javascript
autoFormatInput("123456") // "123.456"
```

## Cách Sử Dụng Trong Components

### Import
```javascript
import { formatCurrency, validateCurrencyInput, autoFormatInput, parseCurrency } from '../../utils/currencyFormatter.js';
```

### Hiển thị tiền tệ
```javascript
// Trong template
<span>{{ formatCurrency(transaction.amount) }}</span>

// Hoặc trong computed
computed: {
    formattedAmount() {
        return formatCurrency(this.amount);
    }
}
```

### Input field với auto format
```javascript
// Template
<input 
    v-model="formData.amount" 
    type="text" 
    @input="handleAmountInput"
    @blur="handleAmountBlur"
/>

// Script
const handleAmountInput = (event) => {
    const value = event.target.value;
    
    if (!validateCurrencyInput(value)) {
        return;
    }
    
    const formatted = autoFormatInput(value);
    formData.amount = formatted;
};

const handleAmountBlur = () => {
    if (formData.amount) {
        const parsed = parseCurrency(formData.amount);
        if (parsed <= 0) {
            errors.amount = 'Số tiền phải lớn hơn 0';
        }
    }
};
```

### Validation khi submit
```javascript
const handleSubmit = () => {
    if (!formData.amount || parseCurrency(formData.amount) <= 0) {
        errors.amount = 'Vui lòng nhập số tiền hợp lệ';
        return;
    }
    
    // Parse amount to number before sending to API
    const submitData = {
        ...formData,
        amount: parseCurrency(formData.amount)
    };
    
    emit('save', submitData);
};
```

## Lưu Ý

1. **Input fields**: Luôn sử dụng `type="text"` thay vì `type="number"` để có thể format với dấu phẩy.
2. **Validation**: Luôn validate input và parse về number trước khi gửi lên API.
3. **Display**: Sử dụng `formatCurrency()` để hiển thị tiền tệ với định dạng đẹp.
4. **Auto format**: Sử dụng `autoFormatInput()` để tự động format khi user nhập.

## Ví Dụ Hoàn Chỉnh

```vue
<template>
    <div>
        <label>Số tiền</label>
        <input 
            v-model="formData.amount" 
            type="text" 
            class="form-control"
            :class="{ 'is-invalid': errors.amount }"
            placeholder="Nhập số tiền" 
            @input="handleAmountInput"
            @blur="handleAmountBlur"
        />
        <div v-if="errors.amount" class="invalid-feedback">{{ errors.amount }}</div>
        
        <div class="mt-3">
            <strong>Tổng tiền: {{ formatCurrency(totalAmount) }}</strong>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { formatCurrency, validateCurrencyInput, autoFormatInput, parseCurrency } from '../../utils/currencyFormatter.js';

const formData = reactive({
    amount: ''
});

const errors = reactive({
    amount: ''
});

const handleAmountInput = (event) => {
    const value = event.target.value;
    
    if (!validateCurrencyInput(value)) {
        return;
    }
    
    const formatted = autoFormatInput(value);
    formData.amount = formatted;
    
    if (errors.amount) {
        errors.amount = '';
    }
};

const handleAmountBlur = () => {
    if (formData.amount) {
        const parsed = parseCurrency(formData.amount);
        if (parsed <= 0) {
            errors.amount = 'Số tiền phải lớn hơn 0';
        }
    }
};

const totalAmount = computed(() => {
    return parseCurrency(formData.amount) || 0;
});
</script> 