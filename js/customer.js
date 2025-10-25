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
    const destinationCity = document.getElementById('destinationCity').value.trim();
    const destinationCountry = document.getElementById('destinationCountry').value.trim();
    const productImage = document.getElementById('productImage').value.trim();
    
    // Validasyon
    if (!customerName || !productName || !weight || weight <= 0) {
        alert('Lütfen tüm gerekli alanları doldurun!');
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
    const distance = calculateDistance(destinationCity, destinationCountry);
    
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
        destination: `${destinationCity}, ${destinationCountry}`,
        destinationCity: destinationCity,
        destinationCountry: destinationCountry,
        productImage: productImage,
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
// Fiyat Sonucunu Göster
// ============================================

function displayPriceResult(shipmentData) {
    const resultContent = document.getElementById('resultContent');
    
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
            <span class="result-label">Hedef:</span>
            <span class="result-value">${shipmentData.destination}</span>
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
        <div class="result-item" style="border-top: 2px solid #667eea; padding-top: 1rem; margin-top: 1rem;">
            <span class="result-label" style="font-size: 1.2rem;">TOPLAM FİYAT:</span>
            <span class="result-value price">₺${shipmentData.totalPrice.toLocaleString('tr-TR')}</span>
        </div>
    `;
    
    document.getElementById('price-result').style.display = 'block';
    document.getElementById('price-result').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// Sevkiyatı Onayla
// ============================================

function confirmShipment() {
    if (!currentShipmentData) {
        alert('Sevkiyat verisi bulunamadı!');
        return;
    }
    
    // Envanteri güncelle
    const inventoryUpdate = updateInventory(currentShipmentData.category, currentShipmentData.weight, 'subtract');
    
    if (inventoryUpdate.error) {
        alert(inventoryUpdate.message);
        return;
    }
    
    // Sevkiyatı kaydet
    const shipments = loadFromStorage(STORAGE_KEYS.SHIPMENTS) || [];
    shipments.push(currentShipmentData);
    saveToStorage(STORAGE_KEYS.SHIPMENTS, shipments);
    
    // Başarı mesajı
    alert(`✅ Sevkiyat başarıyla oluşturuldu!\n\nSipariş ID: ${currentShipmentData.id}\n\nSevkiyatınızı bu ID ile takip edebilirsiniz.`);
    
    // Formu sıfırla
    resetForm();
}

// ============================================
// Formu Sıfırla
// ============================================

function resetForm() {
    document.getElementById('createShipmentForm').reset();
    document.getElementById('shipment-form').style.display = 'none';
    document.getElementById('price-result').style.display = 'none';
    currentShipmentData = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// Sevkiyat Takibi
// ============================================

function trackShipment() {
    const trackingId = document.getElementById('trackingId').value.trim();
    
    if (!trackingId) {
        alert('Lütfen bir sipariş ID girin!');
        return;
    }
    
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
    
    // Konteyner bilgisini al
    let containerInfo = 'Henüz atanmadı';
    if (shipment.containerId) {
        const containers = loadFromStorage(STORAGE_KEYS.CONTAINERS) || [];
        const container = containers.find(c => c.id === shipment.containerId);
        if (container) {
            containerInfo = `${container.type} Container #${container.id}`;
        }
    }
    
    // Durum badge'i
    let statusClass = 'status-pending';
    let statusText = 'Beklemede';
    
    if (shipment.status === 'Ready') {
        statusClass = 'status-ready';
        statusText = 'Taşımaya Hazır';
    } else if (shipment.status === 'In Transit') {
        statusClass = 'status-in-transit';
        statusText = 'Yolda';
    } else if (shipment.status === 'Completed') {
        statusClass = 'status-completed';
        statusText = 'Teslim Edildi';
    }
    
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
                <span class="result-value">${shipment.destination}</span>
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
}

// ============================================
// Yardımcı Fonksiyonlar
// ============================================

function generateShipmentId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `SHP${timestamp}${random}`;
}

function checkInventoryAvailability(category, quantity) {
    const inventory = loadFromStorage(STORAGE_KEYS.INVENTORY);
    
    if (!inventory[category]) {
        return { available: false, currentStock: 0 };
    }
    
    return {
        available: inventory[category].quantity >= quantity,
        currentStock: inventory[category].quantity
    };
}
