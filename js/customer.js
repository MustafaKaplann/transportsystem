// ============================================
// CUSTOMER.JS - Müşteri İşlemleri
// ============================================

let currentShipmentData = null;

// ============================================
// Sevkiyat Formu Göster/Gizle
// ============================================

function showShipmentForm() {
    document.getElementById('shipment-form').style.display = 'block';
    document.getElementById('price-result').style.display = 'none';
    document.getElementById('shipment-form').scrollIntoView({ behavior: 'smooth' });
}

function hideShipmentForm() {
    document.getElementById('shipment-form').style.display = 'none';
}

// ============================================
// Sevkiyat Oluşturma
// ============================================

function createShipment(event) {
    event.preventDefault();

    // Form verilerini al
    const customerName = document.getElementById('customerName').value.trim();
    const productName = document.getElementById('productName').value.trim();
    const category = document.getElementById('category').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const containerType = document.getElementById('containerType').value;
    const shipmentType = document.getElementById('shipmentType').value;
    const destinationCountry = document.getElementById('destinationCountry').value;

    // Validasyon
    if (!customerName || !productName || !weight || weight <= 0 || !shipmentType || !destinationCountry) {
        alert('Lütfen tüm gerekli alanları doldurun!');
        return;
    }

    // Sevkiyat türü ve hedef ülke uyumluluğunu kontrol et
    const compatibilityCheck = checkShipmentCompatibility(shipmentType, destinationCountry);
    if (!compatibilityCheck.compatible) {
        alert(`⚠️ Uyarı: ${compatibilityCheck.message}`);
        return;
    }

    // Konteyner kapasitesi kontrolü
    const containerInfo = CONTAINER_TYPES[containerType];
    if (weight > containerInfo.capacity) {
        alert(`⚠️ Uyarı: Ağırlık (${weight} kg), ${containerType} konteyner kapasitesini (${containerInfo.capacity} kg) aşıyor!\n\nLütfen daha büyük bir konteyner seçin veya ağırlığı azaltın.`);
        return;
    }

    // Envanter kontrolü
    const inventoryCheck = checkInventoryAvailability(category, weight);
    if (!inventoryCheck.available) {
        alert(`⚠️ Stok Uyarısı: ${category} kategorisinde yeterli stok yok!\n\nMevcut Stok: ${inventoryCheck.currentStock} kg\nTalep Edilen: ${weight} kg`);
        return;
    }

    // Mesafe hesapla
    const distance = calculateDistance(destinationCountry, shipmentType);

    // Fiyat hesapla
    const priceResult = calculatePrice(weight, distance, containerType);

    if (priceResult.error) {
        alert(priceResult.message);
        return;
    }

    // Sevkiyat verisini hazırla
    currentShipmentData = {
        id: generateShipmentId(),
        customerName: customerName,
        productName: productName,
        category: category,
        weight: weight,
        containerType: containerType,
        shipmentType: shipmentType,
        destination: `Muğla → ${destinationCountry}`,
        destinationCountry: destinationCountry,
        destinationCity: destinationCountry,
        distance: priceResult.distance,
        totalPrice: priceResult.totalPrice,
        estimatedDays: priceResult.estimatedDays,
        pricePerKm: priceResult.pricePerKm,
        status: 'Pending',
        containerId: null,
        createdAt: new Date().toISOString()
    };

    // Sonuç sayfasını göster
    displayPriceResult(currentShipmentData);
}

// ============================================
// CUSTOMER.JS - Müşteri İşlemleri (Modernized)
// ============================================

// Modern ES6+ features and better error handling
class ShipmentManager {
    constructor() {
        this.currentShipmentData = null;
        this.formValidation = new FormValidation();
        this.notificationManager = new NotificationManager();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupKeyboardNavigation();
    }

    setupEventListeners() {
        // Form submission with modern event handling
        const form = document.getElementById('createShipmentForm');
        if (form) {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Real-time form validation
        const inputs = document.querySelectorAll('#createShipmentForm input, #createShipmentForm select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Tracking form
        const trackingForm = document.getElementById('trackingId');
        if (trackingForm) {
            trackingForm.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.trackShipment();
                }
            });
        }
    }

    setupFormValidation() {
        this.formValidation.addRule('customerName', {
            required: true,
            minLength: 2,
            maxLength: 50,
            message: 'Müşteri adı 2-50 karakter arasında olmalıdır'
        });

        this.formValidation.addRule('productName', {
            required: true,
            minLength: 2,
            maxLength: 100,
            message: 'Ürün adı 2-100 karakter arasında olmalıdır'
        });

        this.formValidation.addRule('weight', {
            required: true,
            min: 1,
            max: 10000,
            type: 'number',
            message: 'Ağırlık 1-10000 kg arasında olmalıdır'
        });

        this.formValidation.addRule('destinationCity', {
            required: true,
            minLength: 2,
            maxLength: 50,
            message: 'Hedef şehir 2-50 karakter arasında olmalıdır'
        });

        this.formValidation.addRule('destinationCountry', {
            required: true,
            minLength: 2,
            maxLength: 50,
            message: 'Hedef ülke 2-50 karakter arasında olmalıdır'
        });

        this.formValidation.addRule('productImage', {
            required: false,
            type: 'url',
            message: 'Geçerli bir URL giriniz'
        });
    }

    setupKeyboardNavigation() {
        // Tab navigation for better accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });
    }

    handleTabNavigation(e) {
        const activeElement = document.activeElement;
        const tabElements = document.querySelectorAll('button, input, select, a[href]');
        const tabList = Array.from(tabElements).filter(el =>
            !el.disabled && !el.hidden && el.offsetParent !== null
        );

        const currentIndex = tabList.indexOf(activeElement);

        if (e.shiftKey && currentIndex === 0) {
            e.preventDefault();
            tabList[tabList.length - 1].focus();
        } else if (!e.shiftKey && currentIndex === tabList.length - 1) {
            e.preventDefault();
            tabList[0].focus();
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();

        try {
            this.showLoadingState();

            // Validate all fields
            const isValid = await this.validateForm();
            if (!isValid) {
                this.hideLoadingState();
                return;
            }

            // Get form data
            const formData = this.getFormData();

            // Validate business rules
            const businessValidation = await this.validateBusinessRules(formData);
            if (!businessValidation.valid) {
                this.notificationManager.showError(businessValidation.message);
                this.hideLoadingState();
                return;
            }

            // Process shipment
            await this.processShipment(formData);

        } catch (error) {
            console.error('Form submission error:', error);
            this.notificationManager.showError('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            this.hideLoadingState();
        }
    }

    async validateForm() {
        const form = document.getElementById('createShipmentForm');
        const formData = new FormData(form);
        let isValid = true;

        for (const [fieldName, value] of formData.entries()) {
            const field = document.getElementById(fieldName);
            if (field) {
                const fieldValid = await this.validateField(field);
                if (!fieldValid) {
                    isValid = false;
                }
            }
        }

        return isValid;
    }

    async validateField(field) {
        const fieldName = field.name || field.id;
        const value = field.value.trim();

        try {
            const validation = this.formValidation.validate(fieldName, value);

            if (validation.valid) {
                this.clearFieldError(field);
                this.showFieldSuccess(field);
                return true;
            } else {
                this.showFieldError(field, validation.message);
                return false;
            }
        } catch (error) {
            console.error(`Validation error for ${fieldName}:`, error);
            this.showFieldError(field, 'Geçersiz veri');
            return false;
        }
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');
            formGroup.classList.remove('success');

            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = message;
            }
        }
    }

    showFieldSuccess(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('success');
            formGroup.classList.remove('error');
        }
    }

    getFormData() {
        const form = document.getElementById('createShipmentForm');
        const formData = new FormData(form);

        return {
            customerName: formData.get('customerName')?.trim(),
            productName: formData.get('productName')?.trim(),
            category: formData.get('category'),
            weight: parseFloat(formData.get('weight')),
            containerType: formData.get('containerType'),
            destinationCity: formData.get('destinationCity')?.trim(),
            destinationCountry: formData.get('destinationCountry')?.trim(),
            productImage: formData.get('productImage')?.trim()
        };
    }

    async validateBusinessRules(formData) {
        try {
            // Container capacity check
            const containerInfo = CONTAINER_TYPES[formData.containerType];
            if (!containerInfo) {
                return { valid: false, message: 'Geçersiz konteyner tipi seçildi' };
            }

            if (formData.weight > containerInfo.capacity) {
                return {
                    valid: false,
                    message: `Ağırlık (${formData.weight} kg), ${formData.containerType} konteyner kapasitesini (${containerInfo.capacity} kg) aşıyor!`
                };
            }

            // Inventory check
            const inventoryCheck = this.checkInventoryAvailability(formData.category, formData.weight);
            if (!inventoryCheck.available) {
                return {
                    valid: false,
                    message: `${formData.category} kategorisinde yeterli stok yok! Mevcut: ${inventoryCheck.currentStock} kg`
                };
            }

            return { valid: true };
        } catch (error) {
            console.error('Business validation error:', error);
            return { valid: false, message: 'Doğrulama sırasında hata oluştu' };
        }
    }

    async processShipment(formData) {
        try {
            // Calculate distance
            const distance = calculateDistance(formData.destinationCity, formData.destinationCountry);

            // Calculate price
            const priceResult = calculatePrice(formData.weight, distance, formData.containerType);

            if (priceResult.error) {
                throw new Error(priceResult.message);
            }

            // Prepare shipment data
            this.currentShipmentData = {
                id: this.generateShipmentId(),
                ...formData,
                destination: `${formData.destinationCity}, ${formData.destinationCountry}`,
                distance: priceResult.distance,
                totalPrice: priceResult.totalPrice,
                estimatedDays: priceResult.estimatedDays,
                pricePerKm: priceResult.pricePerKm,
                status: 'Pending',
                containerId: null,
                createdAt: new Date().toISOString()
            };

            // Display results
            this.displayPriceResult(this.currentShipmentData);
            this.notificationManager.showSuccess('Fiyat hesaplaması tamamlandı!');

        } catch (error) {
            console.error('Shipment processing error:', error);
            throw error;
        }
    }

    showLoadingState() {
        const submitButton = document.querySelector('#createShipmentForm button[type="submit"]');
        if (submitButton) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
        }
    }

    hideLoadingState() {
        const submitButton = document.querySelector('#createShipmentForm button[type="submit"]');
        if (submitButton) {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    generateShipmentId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `SHP${timestamp}${random}`;
    }

    checkInventoryAvailability(category, quantity) {
        const inventory = loadFromStorage(STORAGE_KEYS.INVENTORY);

        if (!inventory[category]) {
            return { available: false, currentStock: 0 };
        }

        return {
            available: inventory[category].quantity >= quantity,
            currentStock: inventory[category].quantity
        };
    }

    displayPriceResult(shipmentData) {
        const resultContent = document.getElementById('resultContent');

        const shipmentTypeText = shipmentData.shipmentType === 'road' ? 'Kara Yolu 🚚' : 'Deniz Yolu 🚢';

        resultContent.innerHTML = `
            <div class="result-item">
                <span class="result-label">Sipariş ID:</span>
                <span class="result-value">${shipmentData.id}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Müşteri:</span>
                <span class="result-value">${shipmentData.customerName}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Ürün:</span>
                <span class="result-value">${shipmentData.productName} (${shipmentData.category})</span>
            </div>
            <div class="result-item">
                <span class="result-label">Ağırlık:</span>
                <span class="result-value">${shipmentData.weight} kg</span>
            </div>
            <div class="result-item">
                <span class="result-label">Konteyner Tipi:</span>
                <span class="result-value">${shipmentData.containerType}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Sevkiyat Türü:</span>
                <span class="result-value">${shipmentTypeText}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Hedef:</span>
                <span class="result-value">${shipmentData.destinationCountry}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Mesafe:</span>
                <span class="result-value">${shipmentData.distance} km</span>
            </div>
            <div class="result-item">
                <span class="result-label">Km Başı Fiyat:</span>
                <span class="result-value">₺${shipmentData.pricePerKm}/km</span>
            </div>
            <div class="result-item">
                <span class="result-label">Tahmini Teslimat:</span>
                <span class="result-value">${shipmentData.estimatedDays} gün</span>
            </div>
                <div class="result-item" style="border-top: 2px solid var(--primary-color); padding-top: 1rem; margin-top: 1rem;">
                <span class="result-label" style="font-size: 1.2rem;">TOPLAM FİYAT:</span>
                <span class="result-value price">₺${shipmentData.totalPrice.toLocaleString('tr-TR')}</span>
            </div>
        `;

        document.getElementById('price-result').style.display = 'block';
        document.getElementById('price-result').scrollIntoView({ behavior: 'smooth' });
    }

    resetForm() {
        document.getElementById('createShipmentForm').reset();
        document.getElementById('shipment-form').style.display = 'none';
        document.getElementById('price-result').style.display = 'none';
        this.currentShipmentData = null;

        // Clear all validation states
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error', 'success');
            const errorElement = group.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = '';
            }
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Form Validation Class
class FormValidation {
    constructor() {
        this.rules = new Map();
    }

    addRule(fieldName, rule) {
        this.rules.set(fieldName, rule);
    }

    validate(fieldName, value) {
        const rule = this.rules.get(fieldName);
        if (!rule) {
            return { valid: true };
        }

        // Required validation
        if (rule.required && (!value || value.trim() === '')) {
            return { valid: false, message: 'Bu alan zorunludur' };
        }

        // Skip other validations if not required and empty
        if (!rule.required && (!value || value.trim() === '')) {
            return { valid: true };
        }

        // Type validation
        if (rule.type === 'number') {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                return { valid: false, message: 'Geçerli bir sayı giriniz' };
            }
        }

        if (rule.type === 'url' && value) {
            try {
                new URL(value);
            } catch {
                return { valid: false, message: 'Geçerli bir URL giriniz' };
            }
        }

        // Length validation
        if (rule.minLength && value.length < rule.minLength) {
            return { valid: false, message: `En az ${rule.minLength} karakter olmalıdır` };
        }

        if (rule.maxLength && value.length > rule.maxLength) {
            return { valid: false, message: `En fazla ${rule.maxLength} karakter olmalıdır` };
        }

        // Numeric range validation
        if (rule.min !== undefined) {
            const numValue = parseFloat(value);
            if (numValue < rule.min) {
                return { valid: false, message: `En az ${rule.min} olmalıdır` };
            }
        }

        if (rule.max !== undefined) {
            const numValue = parseFloat(value);
            if (numValue > rule.max) {
                return { valid: false, message: `En fazla ${rule.max} olmalıdır` };
            }
        }

        return { valid: true };
    }
}

// Notification Manager Class
class NotificationManager {
    constructor() {
        this.notifications = [];
    }

    showSuccess(message, duration = 5000) {
        this.showNotification(message, 'success', duration);
    }

    showError(message, duration = 8000) {
        this.showNotification(message, 'error', duration);
    }

    showWarning(message, duration = 6000) {
        this.showNotification(message, 'warning', duration);
    }

    showInfo(message, duration = 5000) {
        this.showNotification(message, 'info', duration);
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = this.createNotificationElement(message, type);
        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);

        this.notifications.push(notification);
    }

    createNotificationElement(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');

        const icon = this.getIconForType(type);
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()" aria-label="Bildirimi kapat">
                    ×
                </button>
        </div>
    `;

        return notification;
    }

    getIconForType(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    removeNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }
}

// Legacy function compatibility
const shipmentManager = new ShipmentManager();

// Export legacy functions for backward compatibility
window.showShipmentForm = () => {
    document.getElementById('shipment-form').style.display = 'block';
    document.getElementById('price-result').style.display = 'none';
    document.getElementById('shipment-form').scrollIntoView({ behavior: 'smooth' });

    // Focus first input for accessibility
    const firstInput = document.querySelector('#shipment-form input');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
};

window.hideShipmentForm = () => {
    document.getElementById('shipment-form').style.display = 'none';
};

window.createShipment = (event) => {
    shipmentManager.handleFormSubmit(event);
};

window.confirmShipment = async () => {
    if (!shipmentManager.currentShipmentData) {
        shipmentManager.notificationManager.showError('Sevkiyat verisi bulunamadı!');
        return;
    }

    try {
        shipmentManager.showLoadingState();

        // Update inventory
        const inventoryUpdate = updateInventory(
            shipmentManager.currentShipmentData.category,
            shipmentManager.currentShipmentData.weight,
            'subtract'
        );

        if (inventoryUpdate.error) {
            shipmentManager.notificationManager.showError(inventoryUpdate.message);
            return;
        }

        // Save shipment
        const shipments = loadFromStorage(STORAGE_KEYS.SHIPMENTS) || [];
        shipments.push(shipmentManager.currentShipmentData);
        saveToStorage(STORAGE_KEYS.SHIPMENTS, shipments);

        // Success notification
        shipmentManager.notificationManager.showSuccess(
            `Sevkiyat başarıyla oluşturuldu! Sipariş ID: ${shipmentManager.currentShipmentData.id}`
        );

        // Reset form
        shipmentManager.resetForm();

    } catch (error) {
        console.error('Confirm shipment error:', error);
        shipmentManager.notificationManager.showError('Sevkiyat onaylanırken hata oluştu!');
    } finally {
        shipmentManager.hideLoadingState();
    }
};

window.resetForm = () => {
    document.getElementById('createShipmentForm').reset();
    document.getElementById('shipment-form').style.display = 'none';
    document.getElementById('price-result').style.display = 'none';
    shipmentManager.currentShipmentData = null;

    // Clear all validation states
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('error', 'success');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.trackShipment = async () => {
    const trackingId = document.getElementById('trackingId').value.trim();

    if (!trackingId) {
        shipmentManager.notificationManager.showError('Lütfen bir sipariş ID girin!');
        return;
    }

    try {
        shipmentManager.showLoadingState();

        const shipments = loadFromStorage(STORAGE_KEYS.SHIPMENTS) || [];
        const shipment = shipments.find(s => s.id === trackingId);

        if (!shipment) {
            document.getElementById('tracking-result').innerHTML = `
            <div class="alert alert-danger">
                ❌ Sipariş bulunamadı! Lütfen ID'nizi kontrol edin.
            </div>
        `;
            return;
        }

        // Get container info
        let containerInfo = 'Henüz atanmadı';
        if (shipment.containerId) {
            const containers = loadFromStorage(STORAGE_KEYS.CONTAINERS) || [];
            const container = containers.find(c => c.id === shipment.containerId);
            if (container) {
                containerInfo = `${container.type} Container #${container.id}`;
            }
        }

        // Status badge
        let statusClass = 'status-pending';
        let statusText = 'Beklemede';

        const statusMap = {
            'Ready': { class: 'status-ready', text: 'Taşımaya Hazır' },
            'In Transit': { class: 'status-in-transit', text: 'Yolda' },
            'Completed': { class: 'status-completed', text: 'Teslim Edildi' }
        };

        if (statusMap[shipment.status]) {
            statusClass = statusMap[shipment.status].class;
            statusText = statusMap[shipment.status].text;
    }
    
    // Hedef bilgisini düzelt
    const destination = shipment.destinationCountry || shipment.destinationCity || shipment.destination || 'Bilinmiyor';
    const formattedDestination = destination.includes('→') ? destination : `Muğla → ${destination}`;
    
    document.getElementById('tracking-result').innerHTML = `
        <div class="tracking-card">
            <h3>📦 Sevkiyat Detayları</h3>
            <div class="result-item">
                <span class="result-label">Sipariş ID:</span>
                <span class="result-value">${shipment.id}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Müşteri:</span>
                <span class="result-value">${shipment.customerName}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Ürün:</span>
                <span class="result-value">${shipment.productName} (${shipment.weight} kg)</span>
            </div>
            <div class="result-item">
                <span class="result-label">Hedef:</span>
                <span class="result-value">${formattedDestination}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Konteyner:</span>
                <span class="result-value">${containerInfo}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Durum:</span>
                <span class="status-badge ${statusClass}">${statusText}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Tahmini Teslimat:</span>
                <span class="result-value">${shipment.estimatedDays} gün</span>
            </div>
            <div class="result-item">
                <span class="result-label">Ödenen Tutar:</span>
                <span class="result-value price">₺${shipment.totalPrice.toLocaleString('tr-TR')}</span>
            </div>
        </div>
    `;

        shipmentManager.notificationManager.showSuccess('Sevkiyat bilgileri yüklendi!');

    } catch (error) {
        console.error('Track shipment error:', error);
        shipmentManager.notificationManager.showError('Takip sırasında hata oluştu!');
    } finally {
        shipmentManager.hideLoadingState();
    }
};

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        font-family: var(--font-family-sans);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.hide {
        transform: translateX(100%);
    }
    
    .notification-success {
        background: linear-gradient(135deg, #d4edda 0%, #a8e6cf 100%);
        border-left: 4px solid var(--accent-color);
        color: #155724;
    }
    
    .notification-error {
        background: linear-gradient(135deg, #f8d7da 0%, #ffb3ba 100%);
        border-left: 4px solid var(--danger-color);
        color: #721c24;
    }
    
    .notification-warning {
        background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
        border-left: 4px solid var(--warning-color);
        color: #856404;
    }
    
    .notification-info {
        background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
        border-left: 4px solid var(--info-color);
        color: #0c5460;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-icon {
        font-size: 20px;
        flex-shrink: 0;
    }
    
    .notification-message {
        flex: 1;
        font-weight: 500;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
    }
    
    .notification-close:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
// ============================================
// Yeni Eklenen Fonksiyonlar
// ============================================

// Ülke seçeneklerini güncelleyen fonksiyon
window.updateCountryOptions = function () {
    const shipmentType = document.getElementById('shipmentType').value;
    const countrySelect = document.getElementById('destinationCountry');

    // Dropdown'ı temizle
    countrySelect.innerHTML = '<option value="">Hedef ülke seçin</option>';

    if (!shipmentType) {
        countrySelect.innerHTML = '<option value="">Önce sevkiyat türünü seçin</option>';
        return;
    }

    let countries = [];

    if (shipmentType === 'road') {
        countries = Object.keys(window.ROAD_DISTANCES || {});
    } else if (shipmentType === 'sea') {
        countries = Object.keys(window.SEA_DISTANCES || {});
    }

    // Alfabetik olarak sırala
    countries.sort();

    // Ülkeleri dropdown'a ekle
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });
};

// Sevkiyat türü ve hedef ülke uyumluluğunu kontrol eden fonksiyon
window.checkShipmentCompatibility = function (shipmentType, destinationCountry) {
    if (shipmentType === 'road') {
        const roadDistances = window.ROAD_DISTANCES || {};
        if (!roadDistances[destinationCountry]) {
            return {
                compatible: false,
                message: `Muğla'dan ${destinationCountry}'ye kara yolu ile sevkiyat mümkün değildir. Lütfen deniz yolu seçin.`
            };
        }
    } else if (shipmentType === 'sea') {
        const seaDistances = window.SEA_DISTANCES || {};
        if (!seaDistances[destinationCountry]) {
            return {
                compatible: false,
                message: `Muğla'dan ${destinationCountry}'ye deniz yolu ile sevkiyat mümkün değildir. Lütfen kara yolu seçin.`
            };
        }
    }

    return { compatible: true };
};