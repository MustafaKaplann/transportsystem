# 🚢 Transport & Management System

## Proje Hakkında

Bu proje, Muğla'dan dünya çapında kargo taşımacılığı yapan bir nakliye şirketi için kapsamlı bir web tabanlı yönetim sistemidir.

### 🎯 Özellikler

- **Müşteri Arayüzü**: Sevkiyat oluşturma, fiyat hesaplama, kargo takibi
- **Admin Paneli**: Sevkiyat yönetimi, konteyner optimizasyonu, filo takibi, finansal raporlama
- **Otomatik Fiyatlandırma**: Mesafe ve konteyner tipine göre dinamik fiyat hesaplama
- **Konteyner Optimizasyonu**: First-Fit Decreasing algoritması ile verimli yük dağılımı
- **Filo Yönetimi**: 3 gemi ve 4 kamyon takibi
- **Envanter Kontrolü**: Meyve kategorilerine göre stok takibi ve uyarılar
- **Finansal Raporlama**: Gelir, gider, vergi ve kar hesaplamaları

## 📁 Dosya Yapısı

```
transport-system/
├── index.html          # Müşteri ana sayfası
├── admin.html          # Admin paneli
├── css/
│   └── style.css       # Tüm stiller
└── js/
    ├── data.js         # Veri yönetimi ve hesaplamalar
    ├── customer.js     # Müşteri işlemleri
    └── admin.js        # Admin işlemleri
```

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Modern bir web tarayıcı (Chrome, Firefox, Safari, Edge)
- LocalStorage desteği

### Adımlar

1. Tüm dosyaları bir klasöre kaydedin
2. `index.html` dosyasını tarayıcınızda açın
3. Sistem otomatik olarak başlatılacaktır

**Alternatif**: Basit bir web sunucusu kullanabilirsiniz:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Sonra tarayıcıda `http://localhost:8000` adresine gidin.

## 💡 Kullanım Kılavuzu

### Müşteri İşlemleri

#### 1. Yeni Sevkiyat Oluşturma
1. Ana sayfada "Yeni Sevkiyat Oluştur" butonuna tıklayın
2. Formu doldurun:
   - Müşteri adı
   - Ürün bilgileri (ad, kategori, ağırlık)
   - Konteyner tipi (Small/Medium/Large)
   - Hedef şehir ve ülke
3. "Fiyat Hesapla ve Oluştur" butonuna tıklayın
4. Fiyat ve teslimat bilgilerini inceleyin
5. "Sevkiyatı Onayla" ile işlemi tamamlayın

#### 2. Kargo Takibi
1. "Takip" bölümüne gidin
2. Sipariş ID'nizi girin
3. Sevkiyat durumunuzu görün

### Admin İşlemleri

#### 1. Sevkiyat Yönetimi
- Tüm sevkiyatları görüntüleyin
- Sevkiyat durumlarını güncelleyin (Beklemede → Hazır → Yolda → Tamamlandı)
- İstatistikleri takip edin

#### 2. Konteyner Optimizasyonu
1. "Konteyner Optimizasyonu" sekmesine gidin
2. "Konteynerleri Optimize Et" butonuna tıklayın
3. Sistem otomatik olarak:
   - Sevkiyatları ağırlığa göre sıralar
   - En uygun konteynerlere yerleştirir
   - Boş alanı minimize eder

#### 3. Filo Yönetimi
- 3 gemi ve 4 kamyonun bilgilerini görüntüleyin
- Kapasite, yakıt maliyeti ve toplam giderleri inceleyin

#### 4. Finansal Raporlar
1. "Finans" sekmesine gidin
2. "Finansalları Hesapla" butonuna tıklayın
3. Görüntülenen bilgiler:
   - Toplam gelir
   - Toplam giderler
   - Net gelir
   - Vergi (%20)
   - Vergi sonrası kar

#### 5. Envanter Yönetimi
- Meyve kategorilerinin stok durumunu görün
- Düşük stok uyarılarını takip edin
- Kategoriler: Fresh, Frozen, Organic

#### 6. Kapsamlı Raporlar
1. "Raporlar" sekmesine gidin
2. "Rapor Oluştur" butonuna tıklayın
3. Detaylı rapor görüntülenir:
   - Finansal özet
   - Sevkiyat istatistikleri
   - Konteyner kullanımı
   - Kategori bazlı satışlar
   - Mevcut envanter durumu

## 📊 Veri Yapıları

### Konteyner Tipleri
| Tip | Kapasite | Fiyat/km |
|-----|----------|----------|
| Small | 2,000 kg | ₺5 |
| Medium | 5,000 kg | ₺8 |
| Large | 10,000 kg | ₺12 |

### Filo
**Gemiler:**
- BlueSea (100,000 kg)
- OceanStar (120,000 kg)
- AegeanWind (90,000 kg)

**Kamyonlar:**
- RoadKing (10,000 kg)
- FastMove (12,000 kg)
- CargoPro (9,000 kg)
- HeavyLoad (15,000 kg)

### Başlangıç Envanteri
- Fresh: 4,500 kg
- Frozen: 1,200 kg
- Organic: 8,000 kg

## 🧮 Hesaplama Formülleri

### Fiyat Hesaplama
```
Toplam Fiyat = Mesafe (km) × Konteyner Fiyatı (₺/km)
```

### Filo Gideri
```
Gider = (Yakıt Maliyeti/km × Mesafe) + Mürettebat/Sürücü Maliyeti + Bakım
```

### Finansal Hesaplamalar
```
Net Gelir = Toplam Gelir - Toplam Giderler
Vergi = Net Gelir × 0.20
Vergi Sonrası Kar = Net Gelir - Vergi
```

## 🔧 Teknik Detaylar

### Kullanılan Teknolojiler
- **HTML5**: Sayfa yapısı
- **CSS3**: Responsive tasarım, modern UI
- **JavaScript (ES6+)**: İş mantığı, hesaplamalar, veri yönetimi
- **LocalStorage**: Veri kalıcılığı

### Önemli Algoritmalar
1. **First-Fit Decreasing (Konteyner Optimizasyonu)**
   - Sevkiyatları ağırlığa göre sıralar
   - En büyük yükten başlayarak yerleştirme yapar
   - Boş alanı minimize eder

2. **Mesafe Hesaplama**
   - Önceden tanımlı şehir mesafeleri
   - Ülke bazlı varsayılan değerler

3. **Envanter Yönetimi**
   - Otomatik stok güncelleme
   - Minimum stok seviyesi kontrolü
   - Düşük stok uyarıları

## 🎨 Özellikler ve Avantajlar

✅ **Tamamen Responsive**: Mobil, tablet ve masaüstünde mükemmel görünüm
✅ **Kullanıcı Dostu**: Sezgisel arayüz
✅ **Otomatik Hesaplama**: Fiyat, mesafe, vergi otomatik
✅ **Gerçek Zamanlı**: Tüm değişiklikler anında yansır
✅ **Veri Kalıcılığı**: LocalStorage ile veriler korunur
✅ **Kapsamlı Raporlama**: Detaylı analiz ve istatistikler

## 🐛 Bilinen Limitasyonlar

- Mesafe hesaplaması statik veri kullanır (gerçek API entegrasyonu yok)
- LocalStorage kullanıldığı için veriler tarayıcıya özeldir
- Çoklu kullanıcı desteği yok
- Gerçek ödeme entegrasyonu yok

## 🔮 Gelecek Geliştirmeler

- [ ] Google Maps API entegrasyonu
- [ ] Backend ve veritabanı entegrasyonu
- [ ] Kullanıcı authentication sistemi
- [ ] Email bildirimleri
- [ ] PDF rapor export
- [ ] Grafik ve görselleştirmeler
- [ ] Çoklu dil desteği

## 📝 Lisans

Bu proje eğitim amaçlı hazırlanmış bir örnek projedir.

## 👨‍💻 Geliştirici Notları

### Veri Sıfırlama
Tarayıcı konsolunda çalıştırın:
```javascript
localStorage.clear();
location.reload();
```

### Test Senaryosu
1. Müşteri olarak 500 kg Fresh sevkiyat oluşturun (Berlin)
2. Admin paneline gidin
3. Konteynerleri optimize edin
4. Sevkiyat durumunu "Tamamlandı" yapın
5. Finansalları hesaplayın
6. Rapor oluşturun

## 📞 Destek

Sorularınız için proje dokümantasyonunu inceleyin.

---

**Son Güncelleme**: 2025
**Versiyon**: 1.0.0
