// ============================================
// DATA.JS - Veritabanı Simülasyonu
// ============================================

// LocalStorage anahtarları
const STORAGE_KEYS = {
    SHIPMENTS: 'shipments',
    CONTAINERS: 'containers',
    INVENTORY: 'inventory',
    FINANCIALS: 'financials',
    FLEET: 'fleet'
};

// Konteyner tipleri ve fiyatları (Müşteriye Satış Fiyatları)

const CONTAINER_TYPES = {
    Small: {
        capacity: 2000,
        pricePerKm: 25    // ₺25/km (kar marjı dahil)
    },
    Medium: {
        capacity: 5000,
        pricePerKm: 40    // ₺40/km
    },
    Large: {
        capacity: 10000,
        pricePerKm: 65    // ₺65/km
    }
};

// Filo Verileri

const FLEET_DATA = {
    ships: [
        {
            id: 'S001',
            name: 'BlueSea',
            capacity: 100000,
            fuelCostPerKm: 180,  // Deniz yakıtı (HFO) - deniz mili başına ~₺180
            crewCost: 450000,    // Aylık mürettebat maaşları (15-20 kişi)
            maintenance: 250000, // Aylık bakım ve sigorta
            totalExpense: 880000
        },
        {
            id: 'S002',
            name: 'OceanStar',
            capacity: 120000,
            fuelCostPerKm: 220,
            crewCost: 550000,
            maintenance: 300000,
            totalExpense: 1070000
        },
        {
            id: 'S003',
            name: 'AegeanWind',
            capacity: 90000,
            fuelCostPerKm: 150,
            crewCost: 400000,
            maintenance: 200000,
            totalExpense: 750000
        }
    ],
    trucks: [
        {
            id: 'T001',
            name: 'RoadKing',
            capacity: 10000,
            fuelCostPerKm: 45,      // Dizel yakıt ₺45/km (ortalama 4-5 lt/km × ₺40/lt)
            driverCost: 85000,      // Aylık şoför maaşı + primler
            maintenance: 35000,     // Aylık bakım, lastik, sigorta
            totalExpense: 120000
        },
        {
            id: 'T002',
            name: 'FastMove',
            capacity: 12000,
            fuelCostPerKm: 50,
            driverCost: 90000,
            maintenance: 40000,
            totalExpense: 130000
        },
        {
            id: 'T003',
            name: 'CargoPro',
            capacity: 9000,
            fuelCostPerKm: 40,
            driverCost: 80000,
            maintenance: 30000,
            totalExpense: 110000
        },
        {
            id: 'T004',
            name: 'HeavyLoad',
            capacity: 15000,
            fuelCostPerKm: 60,
            driverCost: 95000,
            maintenance: 45000,
            totalExpense: 140000
        }
    ]
};

// Başlangıç envanter verileri
const INITIAL_INVENTORY = {
    Fresh: {
        category: 'Fresh',
        quantity: 4500,
        minStock: 2000,
        status: 'OK'
    },
    Frozen: {
        category: 'Frozen',
        quantity: 1200,
        minStock: 1000,
        status: 'Low'
    },
    Organic: {
        category: 'Organic',
        quantity: 8000,
        minStock: 2500,
        status: 'OK'
    }
};

// Şehirler arası tahmini mesafeler (km) - Muğla'dan
const DISTANCES = {
    // Türkiye
    'Istanbul': 650,
    'Ankara': 570,
    'Izmir': 150,
    'Antalya': 280,
    'Bursa': 500,
    
    // Avrupa
    'Berlin': 3000,
    'Paris': 3200,
    'London': 3500,
    'Rome': 2100,
    'Madrid': 3800,
    'Vienna': 2300,
    'Amsterdam': 3300,
    'Brussels': 3250,
    'Athens': 750,
    'Sofia': 800,
    
    // Orta Doğu
    'Dubai': 3500,
    'Abu Dhabi': 3600,
    'Riyadh': 2800,
    'Kuwait': 2500,
    'Doha': 3200,
    
    // Asya
    'Tokyo': 11000,
    'Beijing': 9000,
    'Shanghai': 9500,
    'Hong Kong': 9800,
    'Singapore': 9200,
    'Bangkok': 8500,
    
    // Amerika
    'New York': 9500,
    'Los Angeles': 12000,
    'Chicago': 10000,
    'Miami': 10500,
    'Toronto': 9800,
    
    // Diğer
    'Sydney': 15000,
    'Melbourne': 15200,
    'Mumbai': 6500,
    'Cairo': 1800
};

// ============================================
// LocalStorage İşlemleri
// ============================================

// Veriyi LocalStorage'a kaydet
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Veriyi LocalStorage'dan oku
function loadFromStorage(key, defaultValue = null) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
}

// Sistemin ilk kurulumu
function initializeSystem() {
    // Sevkiyatları yükle veya başlat
    if (!loadFromStorage(STORAGE_KEYS.SHIPMENTS)) {
        saveToStorage(STORAGE_KEYS.SHIPMENTS, []);
    }
    
    // Konteynerleri yükle veya başlat
    if (!loadFromStorage(STORAGE_KEYS.CONTAINERS)) {
        saveToStorage(STORAGE_KEYS.CONTAINERS, [
            { id: 1, type: 'Small', capacity: 2000, currentLoad: 0, status: 'Available', shipments: [] },
            { id: 2, type: 'Small', capacity: 2000, currentLoad: 0, status: 'Available', shipments: [] },
            { id: 3, type: 'Medium', capacity: 5000, currentLoad: 0, status: 'Available', shipments: [] },
            { id: 4, type: 'Medium', capacity: 5000, currentLoad: 0, status: 'Available', shipments: [] },
            { id: 5, type: 'Large', capacity: 10000, currentLoad: 0, status: 'Available', shipments: [] },
            { id: 6, type: 'Large', capacity: 10000, currentLoad: 0, status: 'Available', shipments: [] }
        ]);
    }
    
    // Envanteri yükle veya başlat
    if (!loadFromStorage(STORAGE_KEYS.INVENTORY)) {
        saveToStorage(STORAGE_KEYS.INVENTORY, INITIAL_INVENTORY);
    }
    
    // Filoyu yükle veya başlat
    if (!loadFromStorage(STORAGE_KEYS.FLEET)) {
        saveToStorage(STORAGE_KEYS.FLEET, FLEET_DATA);
    }
    
    // Finansalları yükle veya başlat
    if (!loadFromStorage(STORAGE_KEYS.FINANCIALS)) {
        saveToStorage(STORAGE_KEYS.FINANCIALS, {
            totalRevenue: 0,
            totalExpenses: 0,
            netIncome: 0,
            tax: 0,
            profitAfterTax: 0
        });
    }
}

// ============================================
// Mesafe Hesaplama Fonksiyonu
// ============================================

// ============================================
// Mesafe Hesaplama Fonksiyonu
// ============================================

function calculateDistance(country, shipmentType) {
    // Sevkiyat türüne göre uygun mesafe verisini seç
    let distances;
    
    if (shipmentType === 'road') {
        distances = window.ROAD_DISTANCES || {};
    } else if (shipmentType === 'sea') {
        distances = window.SEA_DISTANCES || {};
    } else {
        return 2500; // Varsayılan mesafe
    }
    
    // Ülke adını bul
    if (distances[country]) {
        return distances[country];
    }
    
    // Eğer bulunamazsa DISTANCES'dan (eski veri) dene
    if (DISTANCES[country]) {
        return DISTANCES[country];
    }
    
    return 2500; // Varsayılan mesafe
}

// ============================================
// Fiyat Hesaplama
// ============================================

function calculatePrice(weight, distance, containerType) {
    const containerInfo = CONTAINER_TYPES[containerType];
    
    if (!containerInfo) {
        throw new Error('Geçersiz konteyner tipi');
    }
    
    // Kapasite kontrolü
    if (weight > containerInfo.capacity) {
        return {
            error: true,
            message: `Ağırlık ${containerType} konteyner kapasitesini (${containerInfo.capacity} kg) aşıyor!`
        };
    }
    
    // Fiyat hesaplama
    const totalPrice = distance * containerInfo.pricePerKm;
    
    // Tahmini teslimat süresi (gün) - her 500 km için 1 gün
    const estimatedDays = Math.ceil(distance / 500);
    
    return {
        error: false,
        totalPrice: totalPrice,
        distance: distance,
        estimatedDays: estimatedDays,
        pricePerKm: containerInfo.pricePerKm
    };
}

// ============================================
// Envanter Güncelleme
// ============================================

function updateInventory(category, quantity, operation = 'subtract') {
    const inventory = loadFromStorage(STORAGE_KEYS.INVENTORY);
    
    if (!inventory[category]) {
        return { error: true, message: 'Geçersiz kategori' };
    }
    
    if (operation === 'subtract') {
        if (inventory[category].quantity < quantity) {
            return { error: true, message: `${category} kategorisinde yeterli stok yok! Mevcut: ${inventory[category].quantity} kg` };
        }
        inventory[category].quantity -= quantity;
    } else {
        inventory[category].quantity += quantity;
    }
    
    // Stok durumunu güncelle
    if (inventory[category].quantity < inventory[category].minStock) {
        inventory[category].status = 'Low';
    } else {
        inventory[category].status = 'OK';
    }
    
    saveToStorage(STORAGE_KEYS.INVENTORY, inventory);
    return { error: false, inventory: inventory[category] };
}

// ============================================
// Sistem Başlatma
// ============================================

// Sayfa yüklendiğinde sistemi başlat
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
});
