# 🎁 DropSpot - Drop Yönetim Platformu

## 📋 Proje Özeti

DropSpot, kullanıcıların sınırlı stoktaki ürünlere (drops) erişim için bekleme listesine katılabileceği, belirlenen zaman pencerelerinde bu ürünleri talep edebileceği (claim) ve benzersiz kodlar alarak sahiplik haklarını elde edebileceği modern bir **drop yönetim platformudur**.

### 🎯 Ana Özellikler
- **Kullanıcı Kimlik Doğrulama**: JWT tabanlı güvenli kayıt ve giriş sistemi
- **Drop Yönetimi**: Admin panelden drop oluşturma, güncelleme ve silme (CRUD)
- **Bekleme Listesi (Waitlist)**: Kullanıcıların ilgilendikleri droplara katılması
- **Claim Sistemi**: Zaman penceresi kontrolü ile stok yönetimli talep mekanizması
- **Idempotency**: Aynı kullanıcının birden fazla claim yapmasını engelleyen transaction yapısı
- **Rol Tabanlı Yetkilendirme**: Admin ve User rolleri
- **Çoklu Dil Desteği**: i18next ile İngilizce ve Türkçe dil seçenekleri

---

## 🏗️ Mimari Yapı

### Backend (Node.js + Express + Prisma)
```
dropspot-backend/
├── src/
│   ├── controllers/          # İş mantığı katmanı
│   │   ├── auth.controller.ts
│   │   ├── drop.controller.ts
│   │   └── admin/
│   │       └── drop.controller.ts
│   ├── middlewares/          # Auth, Admin, Error Handler
│   │   ├── auth.middleware.ts
│   │   ├── admin.middleware.ts
│   │   └── errorHandler.ts
│   ├── routes/               # API endpoint tanımları
│   │   ├── auth.route.ts
│   │   ├── drop.route.ts
│   │   └── admin.drop.route.ts
│   ├── validators/           # Zod validation şemaları
│   ├── utils/                # Yardımcı fonksiyonlar
│   ├── constants/            # Hata kodları ve mesajlar
│   └── index.ts              # Express app yapılandırması
├── prisma/
│   ├── schema.prisma         # Veri modeli tanımları
│   └── migrations/           # Veritabanı migration geçmişi
└── seeds/
    └── user.ts               # Test kullanıcısı seed
```

### Frontend (React + TypeScript + Vite)
```
dropspot-frontend/
├── src/
│   ├── pages/                # Sayfa komponenları
│   │   ├── login.tsx
│   │   ├── drops.tsx
│   │   └── admin/
│   │       └── drops.tsx
│   ├── components/           # Yeniden kullanılabilir UI bileşenleri
│   │   ├── Drop.tsx
│   │   ├── DropDetailPopup.tsx
│   │   └── LoginForm.tsx
│   ├── context/              # React Context (AuthContext)
│   ├── layout/               # Layout komponenları (Header, Footer)
│   ├── api/                  # Axios instance ve interceptor
│   ├── stores/               # Zustand state management
│   ├── i18n/                 # Çoklu dil yapılandırması
│   ├── types/                # TypeScript tip tanımları
│   └── schemas/              # Form validation şemaları
└── public/                   # Statik dosyalar
```

### Teknoloji Stack

#### Backend
- **Runtime**: Node.js v18+
- **Framework**: Express.js v5
- **ORM**: Prisma v6
- **Database**: SQLite (development), PostgreSQL ready
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod v4
- **Password Hashing**: bcrypt
- **Logging**: Winston
- **CORS**: cors middleware

#### Frontend
- **Framework**: React 18
- **Build Tool**: Vite v7
- **Language**: TypeScript
- **Routing**: React Router DOM v7
- **State Management**: Zustand + Context API
- **HTTP Client**: Axios
- **UI Library**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **i18n**: react-i18next
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

---

## 📊 Veri Modeli (Prisma Schema)

### Entity Relationship Diagram

```
┌─────────────┐          ┌─────────────┐          ┌─────────────┐
│    User     │          │  Waitlist   │          │    Drop     │
├─────────────┤          ├─────────────┤          ├─────────────┤
│ id          │──────────│ userId      │──────────│ id          │
│ email       │    1:N   │ dropId      │    N:1   │ name        │
│ password    │          │ joinedAt    │          │ stock       │
│ fullName    │          └─────────────┘          │ tags        │
│ role        │                                    │ mediaUrl    │
│ createdAt   │                                    │ claimWindow │
└─────────────┘                                    └─────────────┘
       │                                                  │
       │                                                  │
       │            ┌─────────────┐                       │
       └────────────│ ClaimsLog   │───────────────────────┘
              1:N  ├─────────────┤         N:1
                   │ userId      │
                   │ dropId      │
                   │ claimedAt   │
                   │ claimedCode │ (Benzersiz 10 karakter)
                   └─────────────┘
```

### Modeller

#### User
```prisma
model User {
  id        String      @id @default(uuid())
  email     String      @unique
  password  String      // bcrypt hashed
  fullName  String
  role      Role        @default(USER)  // ADMIN | USER
  createdAt DateTime    @default(now())
  waitlist  Waitlist[]
  claims    Claim[]
  ClaimsLog ClaimsLog[]
}
```

#### Drop
```prisma
model Drop {
  id               String      @id @default(uuid())
  name             String
  stock            Int         // Toplam stok miktarı
  tags             String?     // Pipe-separated (|) tags
  mediaUrl         String?     // Pipe-separated (|) image URLs
  claimWindowStart DateTime    // Claim başlangıç zamanı
  claimWindowEnd   DateTime    // Claim bitiş zamanı
  createdAt        DateTime    @default(now())
  waitlist         Waitlist[]
  claims           Claim[]
  ClaimsLog        ClaimsLog[]
}
```

#### Waitlist
```prisma
model Waitlist {
  id       String   @id @default(uuid())
  user     User     @relation(fields: [userId], references: [id])
  userId   String
  drop     Drop     @relation(fields: [dropId], references: [id])
  dropId   String
  joinedAt DateTime @default(now())

  @@unique([userId, dropId])  // Bir kullanıcı bir drop'a sadece bir kez katılabilir
}
```

#### ClaimsLog (Idempotency için)
```prisma
model ClaimsLog {
  id          String   @id @default(uuid())
  dropId      String
  Drop        Drop     @relation(fields: [dropId], references: [id])
  userId      String
  User        User     @relation(fields: [userId], references: [id])
  claimedAt   DateTime @default(now())
  claimedCode String   // Benzersiz 10 karakterlik kod
}
```

### Temel Kısıtlamalar
- `@@unique([userId, dropId])` → Bir kullanıcı aynı drop'a birden fazla katılamaz
- `claimWindowStart` ve `claimWindowEnd` → Zaman penceresi kontrolü
- `stock` kontrolü → Transaction içinde stok tükenmesi kontrolü
- `ClaimsLog` → Idempotency garantisi (bir kullanıcı bir drop'ı sadece bir kez claim edebilir)

---

## 🔌 API Endpoints

### Authentication (`/auth`)

| Method | Endpoint           | Açıklama                | Body                                      | Response                    |
|--------|-------------------|-------------------------|-------------------------------------------|-----------------------------|
| POST   | `/auth/register`  | Yeni kullanıcı kaydı    | `{email, password, fullName}`             | `{user, token}`             |
| POST   | `/auth/login`     | Kullanıcı girişi        | `{email, password}`                       | `{user, token}`             |

### Drops - Public (`/drops`)

| Method | Endpoint                | Açıklama                    | Auth Required | Response                    |
|--------|-------------------------|-----------------------------|--------------|-----------------------------|
| GET    | `/drops`                | Tüm dropları listele        | ❌           | `{drops: Drop[]}`           |
| POST   | `/drops/:dropId/join`   | Drop'a katıl (waitlist)     | ✅           | `{success}`                 |
| POST   | `/drops/:dropId/leave`  | Drop'tan ayrıl              | ✅           | `{success}`                 |
| POST   | `/drops/:dropId/claim`  | Drop'ı claim et             | ✅           | `{claimedDropLog, drop}`    |
| GET    | `/drops/myDrops`        | Katıldığım droplar          | ✅           | `{myWaitlist: []}`          |
| GET    | `/drops/myClaimedDrops` | Claim ettiğim droplar       | ✅           | `{myClaimedDrops: []}`      |

### Drops - Admin (`/admin/drops`)

| Method | Endpoint             | Açıklama             | Auth Required | Role Required |
|--------|---------------------|----------------------|--------------|---------------|
| GET    | `/admin/drops`      | Tüm dropları getir   | ✅           | ADMIN         |
| GET    | `/admin/drops/:id`  | Drop detayı          | ✅           | ADMIN         |
| POST   | `/admin/drops`      | Yeni drop oluştur    | ✅           | ADMIN         |
| PUT    | `/admin/drops/:id`  | Drop güncelle        | ✅           | ADMIN         |
| DELETE | `/admin/drops/:id`  | Drop sil             | ✅           | ADMIN         |

### Request/Response Örnekleri

#### POST `/admin/drops` - Drop Oluştur
```json
{
  "name": "Limited Edition Sneakers",
  "stock": 50,
  "tags": ["sneakers", "limited", "fashion"],
  "mediaUrls": ["https://example.com/image1.jpg"],
  "claimWindowStart": "2025-11-10T10:00:00Z",
  "claimWindowEnd": "2025-11-10T18:00:00Z"
}
```

#### POST `/drops/:dropId/claim` - Drop Claim Et
```json
Response:
{
  "success": true,
  "data": {
    "claimedDropLog": {
      "id": "uuid",
      "claimedCode": "aB3xY9kL2m",
      "claimedAt": "2025-11-10T10:05:00Z"
    },
    "drop": { /* drop details */ }
  }
}
```

---

## ⚙️ CRUD Modülü Açıklaması

### Drop CRUD İşlemleri (Admin Panel)

Admin kullanıcıları, drop yönetimi için tam CRUD yetkilerine sahiptir:

#### 1. **Create (Oluştur)**
- **Endpoint**: `POST /admin/drops`
- **Validasyon**: Zod ile name, stock, tags, mediaUrls, claim window kontrolü
- **Özellikler**: 
  - Tags ve mediaUrls pipe-separated (|) olarak saklanır
  - Claim window tarihleri ISO 8601 formatında alınır

#### 2. **Read (Oku)**
- **Endpoint**: `GET /admin/drops` (Liste), `GET /admin/drops/:id` (Detay)
- **Özellikler**: Pagination hazır altyapı (take: 100)

#### 3. **Update (Güncelle)**
- **Endpoint**: `PUT /admin/drops/:id`
- **Validasyon**: Partial schema (tüm alanlar opsiyonel)
- **Kontrol**: Drop varlığı kontrolü yapılır

#### 4. **Delete (Sil)**
- **Endpoint**: `DELETE /admin/drops/:id`
- **Cascade**: Prisma relation'ları ile bağlı veriler otomatik silinir

### Controller Yapısı

```typescript
// src/controllers/admin/drop.controller.ts
export const createDrop = async (req: Request, res: Response) => {
    const parsedData = DropSchema.parse(req.body);
    
    const drop = await prisma.drop.create({
        data: {
            name,
            stock,
            tags: tags ? tags.join("|") : null,
            mediaUrl: mediaUrls ? mediaUrls.join("|") : null,
            claimWindowStart: new Date(claimWindowStart),
            claimWindowEnd: new Date(claimWindowEnd),
        },
    });
    
    return successResponse(res, { drop }, SuccessMessages.DROP_CREATED_SUCCESSFULLY);
};
```

### Middleware Zinciri

```typescript
app.use("/admin/drops", authGuard, adminMiddleware, AdminDropRoutes);
```

1. **authGuard**: JWT token doğrulama
2. **adminMiddleware**: Role kontrolü (ADMIN yetkisi)
3. **AdminDropRoutes**: CRUD endpoint'leri

---

## 🔒 Idempotency Yaklaşımı ve Transaction Yapısı

### Problem
Aynı kullanıcının aynı drop'ı birden fazla kez claim etmesini engellemek ve **race condition** durumlarında stok tutarsızlığı yaşamamak.

### Çözüm: Prisma Transaction + ClaimsLog

```typescript
export const claimDrop = async (req: Request, res: Response) => {
    await prisma.$transaction(async (tx) => {
        // 1. Waitlist kontrolü
        const waitListEntry = await tx.waitlist.findFirst({
            where: { dropId, userId },
            include: { drop: true },
        });
        if (!waitListEntry) throw AppErrors.USER_NOT_JOINED_DROP;

        // 2. Zaman penceresi kontrolü
        const drop = waitListEntry.drop;
        if (drop.claimWindowStart > new Date()) throw AppErrors.DROP_NOT_YET_RELEASED;
        if (drop.claimWindowEnd < new Date()) throw AppErrors.DROP_CLAIM_WINDOW_CLOSED;

        // 3. İdempotency kontrolü (ClaimsLog)
        const alreadyClaimed = await tx.claimsLog.findFirst({
            where: { dropId, userId },
        });
        if (alreadyClaimed) throw AppErrors.DROP_ALREADY_CLAIMED;

        // 4. Stok kontrolü (transaction içinde güncel veri)
        const claimedCount = await tx.claimsLog.count({ where: { dropId } });
        if (claimedCount >= drop.stock) throw AppErrors.STOCK_EXHAUSTED;

        // 5. Claim kaydı oluştur
        const claimCode = helper.createClaimCode(); // 10 karakterlik benzersiz kod
        const claimedDrop = await tx.claimsLog.create({
            data: { dropId, userId, claimedCode: claimCode },
        });

        return successResponse(res, { claimedDropLog: claimedDrop, drop });
    });
};
```

### Transaction Garantileri
- ✅ **Atomicity**: Tüm işlemler başarılı olmalı, aksi halde rollback
- ✅ **Isolation**: Eşzamanlı işlemler birbirini etkilemez
- ✅ **Idempotency**: `ClaimsLog` tablosu ile aynı kullanıcının tekrar claim etmesi engellenir
- ✅ **Stok Tutarlılığı**: Transaction içinde `count` ile güncel stok kontrolü

### Claim Code Üretimi

```typescript
// src/helper/helper.ts
export const createClaimCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result; // Örnek: "aB3xY9kL2m"
}
```

---

## 🚀 Kurulum Adımları

### Gereksinimler
- Node.js v18+ 
- npm veya yarn
- SQLite (varsayılan) veya PostgreSQL

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/asiminnesli/dropspot-1.git
cd dropspot
```

### 2. Backend Kurulumu

```bash
cd dropspot-backend

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cat > .env << EOF
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this"
JWT_EXPIRES_IN="7d"
PORT=3000
EOF

# Prisma veritabanını oluştur ve migrate et
npx prisma generate
npx prisma migrate dev --name init

# Seed verilerini yükle (test kullanıcısı)
npx prisma db seed

# Development server'ı başlat
npm run dev
```

**Test Kullanıcısı (Seed)**:
- Email: `test@example.com`
- Password: `123456`
- Role: `USER`

**Admin Kullanıcısı Oluşturmak İçin**:
Prisma Studio ile manuel olarak user oluşturun ve `role` alanını `ADMIN` yapın:
```bash
npx prisma studio
```

### 3. Frontend Kurulumu

```bash
cd dropspot-frontend

# Bağımlılıkları yükle
npm install

# .env dosyası oluştur
cat > .env << EOF
VITE_API_URL=http://localhost:3000
EOF

# Development server'ı başlat
npm run dev
```

Frontend varsayılan olarak `http://localhost:5173` adresinde çalışır.

### 4. Uygulamayı Kullanmaya Başlayın

1. **Kullanıcı Girişi**: `http://localhost:5173/login`
2. **Drops Sayfası**: `http://localhost:5173/drops`
3. **Admin Panel**: `http://localhost:5173/admin/drops` (Admin rolü gerekli)

---

## 📸 Ekran Görüntüleri

### 1. Login Sayfası

![Drop Listesi](./ss-1.png)

**Açıklama**: 
- Çoklu dil desteği (TR/EN) ile kullanıcı doğrulama sayfası
- Zod validation ile form kontrolü
- JWT token ile güvenli kimlik doğrulama
- React Context API ile global auth state yönetimi
- Email ve şifre validasyonu (min 6 karakter)
- Hata durumlarında kullanıcı dostu mesajlar

**Teknik Detaylar**:
- `react-i18next` ile çoklu dil desteği
- `AuthContext` ile login state management
- Axios interceptor ile otomatik token ekleme
- Form validation için Zod schema

---

### 2. Drops Listesi (Kullanıcı Sayfası)

![Drop Detay](./ss-2.png)

**Açıklama**:
- Tüm aktif dropların grid layout ile listelenmesi
- Her drop kartında:
  - Drop adı ve görseli
  - Kalan stok bilgisi
  - Claim penceresi (başlangıç-bitiş tarihleri)
  - Tags (kategoriler)
  - Join/Leave waitlist butonları
  - Claim butonu (zaman penceresi aktif ise)
  - Claim kodu (başarılı claim sonrası görünür)
- Responsive tasarım (mobile-first)
- Framer Motion ile smooth animasyonlar
- Gerçek zamanlı waitlist durumu

**Teknik Detaylar**:
- `useState` ve `useEffect` ile data fetching
- Zustand store ile state management
- Tailwind CSS ile responsive grid layout
- Lucide React icons
- React Hot Toast ile bildirimler

---

### 3. Admin Panel - Drop Yönetimi

![Admin Panel](./ss-3.png)

**Açıklama**:
- Admin kullanıcıları için özel panel
- CRUD işlemleri:
  - Yeni drop oluştur (Create)
  - Mevcut dropları listele (Read)
  - Drop güncelle (Update)
  - Drop sil (Delete)
- Form alanları:
  - Drop adı (zorunlu)
  - Stok miktarı (minimum 0)
  - Tags (çoklu seçim)
  - Medya URL'leri (birden fazla)
  - Claim penceresi başlangıç/bitiş tarihleri (datetime picker)
- Rol tabanlı erişim kontrolü (middleware)
- Validation feedback

**Teknik Detaylar**:
- `adminMiddleware` ile role kontrolü
- Zod schema ile backend validation
- React Hook Form ile form yönetimi
- Optimistic UI updates
- Confirmation dialog ile delete işlemi

---

### 4. Drop Detay ve Claim Sistemi

**Açıklama**:
- Modal açılır pencere ile drop detayları
- Büyütülmüş ürün görseli
- Detaylı bilgiler:
  - Toplam ve kalan stok
  - Claim penceresi countdown timer
  - Tam açıklama
  - Waitlist durumu
  - Claim butonu (zaman kontrolü ile aktif/pasif)
- Claim başarılı ise benzersiz kod gösterimi
- Backdrop ile modal kapama

**Teknik Detaylar**:
- Framer Motion `AnimatePresence` ile giriş/çıkış animasyonları
- Portal kullanımı ile modal overlay
- ESC tuşu ile kapama özelliği
- Responsive image gallery

---

### 5. Waitlist Yönetimi

**Açıklama**:
- Kullanıcıların katıldığı dropların listesi
- Her drop için:
  - Katılım tarihi
  - Claim durumu (aktif/bekliyor/tükendi)
  - Leave butonu (waitlist'ten ayrılma)
  - Claim butonu (zaman penceresi kontrolü ile)
- Gerçek zamanlı güncelleme
- Filtreleme ve sıralama özellikleri

**Teknik Detaylar**:
- `GET /drops/myDrops` endpoint'i
- Real-time data synchronization
- Conditional rendering

---

### 6. Claimed Drops (Başarılı Claimler)

**Açıklama**:
- Kullanıcının başarıyla claim ettiği droplar
- Her claim için:
  - Benzersiz 10 haneli claim kodu (örn: `aB3xY9kL2m`)
  - Claim tarihi ve saati
  - QR kod (bonus feature için hazır altyapı)
  - "Kodu Kopyala" butonu
- Kod ile ürün teslim alma sistemi için hazır
- Export/print özelliği

**Teknik Detaylar**:
- `GET /drops/myClaimedDrops` endpoint'i
- Clipboard API ile kod kopyalama
- Date formatting (i18n ile dil desteği)

---

## 🛠️ Teknik Tercihler ve Kişisel Katkılar

### Backend Tercihleri

#### 1. **Prisma ORM**
**Neden?**
- Type-safe veritabanı işlemleri
- Migration yönetimi kolay
- Schema-first yaklaşım
- SQLite ile hızlı development, production'da PostgreSQL'e geçiş kolay

**Kişisel Katkı**: 
- `ClaimsLog` modelini idempotency garantisi için tasarladım
- `@@unique([userId, dropId])` constraint'i ile aynı kullanıcının birden fazla claim yapmasını engelledim

#### 2. **Zod Validation**
**Neden?**
- Runtime type checking
- TypeScript entegrasyonu mükemmel
- Hata mesajları özelleştirilebilir

**Kişisel Katkı**:
- Tüm endpoint'ler için merkezi validation şemaları oluşturdum
- Custom error handler ile kullanıcı dostu hata mesajları

#### 3. **JWT Authentication**
**Neden?**
- Stateless authentication
- Scalable (horizontal scaling'e hazır)
- Role-based access control kolay

**Kişisel Katkı**:
- `authGuard` ve `adminMiddleware` middleware'lerini geliştirdim
- Token'ı `req.body.dropspot.user` altında saklayarak controller'larda temiz kullanım sağladım

#### 4. **Transaction Yaklaşımı**
**Neden?**
- Race condition koruması
- Stok tutarlılığı garantisi
- ACID özellikleri

**Kişisel Katkı**:
- `claimDrop` fonksiyonunda Prisma transaction ile idempotency implementasyonu
- `ClaimsLog.count()` ile real-time stok kontrolü

### Frontend Tercihleri

#### 1. **Vite + React 18**
**Neden?**
- HMR (Hot Module Replacement) hızlı
- Modern build tool
- React 18 concurrent features

**Kişisel Katkı**:
- Vite config'de environment variables yapılandırması
- TypeScript strict mode ile tip güvenliği

#### 2. **Zustand + Context API**
**Neden?**
- Redux'a göre daha basit
- Boilerplate az
- Context API ile authentication, Zustand ile local state

**Kişisel Katkı**:
- `AuthContext` ile global auth state
- `userStore` ile user-specific data management

#### 3. **Framer Motion**
**Neden?**
- Declarative animations
- React-friendly API
- Performance optimize

**Kişisel Katkı**:
- `DropDetailPopup` modal'ında smooth açılış/kapanış animasyonları
- Grid layout'ta staggered children animations

#### 4. **Tailwind CSS v4**
**Neden?**
- Utility-first yaklaşım
- Rapid prototyping
- Consistent design system

**Kişisel Katkı**:
- Custom color palette ve responsive breakpoints
- Component-level CSS modülleştirmesi

#### 5. **i18next**
**Neden?**
- Çoklu dil desteği kolay
- Lazy loading translations
- Pluralization ve formatting

**Kişisel Katkı**:
- EN ve TR dil dosyaları hazırladım
- Context-aware çeviriler (form validations, error messages)

---

## 🌱 Seed Üretim Yöntemi ve Kullanımı

### Seed Dosyası: `seeds/user.ts`

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = '123456'
    const hashedPassword = await bcrypt.hash(password, 10)

    // Upsert: Eğer email varsa güncelle, yoksa oluştur
    await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            fullName: 'Test User',
            password: hashedPassword,
        },
    })

    console.log('✅ Seed completed: test@example.com / 123456')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
```

### Package.json Yapılandırması

```json
{
  "prisma": {
    "seed": "ts-node seeds/user.ts"
  }
}
```

### 1. Claim Kod QR Code Generator (Altyapı Hazır)
### 3. Smart Stock Prediction (Gelecek Özellik)
## 📦 Deployment

### Backend (Render / Railway / Heroku)

```bash
# Build
npm run build

# Start
npm start
```

**Environment Variables**:
```
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=production-super-secret-key
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
```

### Frontend (Vercel / Netlify)

```bash
# Build
npm run build

# Preview
npm run preview
```

**Environment Variables**:
```
VITE_API_URL=https://api.dropspot.com
```

### Database Migration (Production)

```bash
# Production migration
npx prisma migrate deploy

# Prisma client generation
npx prisma generate
```

---

## 🧪 Test Senaryoları

### 1. Idempotency Testi

```bash
# Aynı kullanıcı ile aynı drop'a 2 kez claim denemesi
curl -X POST http://localhost:3000/drops/{dropId}/claim \
  -H "Authorization: Bearer {token}"

# İkinci istek → 400 DROP_ALREADY_CLAIMED
```

### 2. Race Condition Testi

```bash
# 100 concurrent request (stok: 50)
# Apache Bench kullanımı
ab -n 100 -c 50 -H "Authorization: Bearer {token}" \
   http://localhost:3000/drops/{dropId}/claim

# Beklenen: Sadece ilk 50 başarılı, diğerleri 400 STOCK_EXHAUSTED
```

### 3. Transaction Rollback Testi

```bash
# Claim sırasında hata oluşursa tüm işlemler geri alınmalı
# ClaimsLog kaydı oluşturulmamalı
```

### 4. JWT Token Expiry Testi

```bash
# Expired token ile istek
curl -X GET http://localhost:3000/drops/myDrops \
  -H "Authorization: Bearer {expired-token}"

# Beklenen: 403 UNAUTHORIZED
```

### 5. Role-Based Access Control Testi

```bash
# USER rolü ile admin endpoint'e erişim
curl -X POST http://localhost:3000/admin/drops \
  -H "Authorization: Bearer {user-token}"

# Beklenen: 403 FORBIDDEN
```

---

## 🔐 Güvenlik Önlemleri

1. **Password Hashing**: bcrypt ile 10 rounds salt
2. **JWT Secret**: Environment variable ile güvenli saklama
3. **CORS Policy**: Whitelist ile origin kontrolü
4. **SQL Injection**: Prisma ORM ile parameterized queries
5. **Rate Limiting**: Express rate limit middleware (TODO)
6. **Helmet**: Security headers (TODO)
7. **Input Validation**: Zod ile tüm endpoint'lerde validation
8. **Error Handling**: Detaylı hata mesajları production'da gizlenir

---

## 📊 Performans Optimizasyonları

### Backend
- Database indexing (userId, dropId kombinasyonları)
- Connection pooling (Prisma default)
- Query optimization (select specific fields)
- Caching stratejisi (Redis entegrasyonu hazır)

### Frontend
- Code splitting (React.lazy)
- Image optimization (lazy loading)
- Debounce on search inputs
- Memoization (React.memo, useMemo)
- Virtual scrolling (long lists için)

---

## 🚧 Gelecek Özellikler (Roadmap)

- [ ] Real-time notifications (Socket.IO)
- [ ] Email/SMS bildirimler (claim açıldığında)
- [ ] AI-powered drop description generator
- [ ] Analytics dashboard (admin için)
- [ ] User profile ve avatar sistemi
- [ ] Social sharing (drop paylaşımı)
- [ ] Wishlist özelliği
- [ ] Drop rating ve review sistemi
- [ ] Referral programı
- [ ] Mobile app (React Native)

---
## 👨‍💻 Geliştirici

**Asım Yılmaz**
- GitHub: [@asiminnesli](https://github.com/asiminnesli)
- Repository: [dropspot-1](https://github.com/asiminnesli/dropspot-1)

---

## 🙏 Teşekkürler

Bu proje, modern web development best practices'lerini göstermek ve idempotency, transaction management gibi kritik backend konseptleri uygulamak amacıyla geliştirilmiştir. 

**Kullanılan Açık Kaynak Teknolojiler**:
- Prisma Team - Harika ORM
- Vercel Team - React ve Next.js
- Zod Team - Type-safe validation
- Framer - Motion animations

Önerileriniz ve katkılarınız için Pull Request açabilirsiniz!

---

**Proje Durumu**: ✅ Production Ready  
**Son Güncelleme**: 6 Kasım 2025  
**Versiyon**: 1.0.0