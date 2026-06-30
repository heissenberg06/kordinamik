# Kordinamik

Kordinamik için ana site, bayi/admin yönetim sistemi ve garanti kayıt uygulamalarını içeren monorepo.

## Proje Yapısı

| Klasör | Açıklama | Stack | Port |
|---|---|---|---|
| `kordinamik-admin` | Backend API (auth, ürünler, bayiler, siparişler, garanti) | Node.js + Express + PostgreSQL (Sequelize) | 3001 |
| `kordinamik-admin-panel` | Admin yönetim paneli arayüzü | React | 3002 |
| `kordinamik` | Ana site / bayi portalı | React | 3000 |
| `kordinamik-garanti` | Ürün garanti kayıt formu | React + Vite | 5173 |

Veritabanı şeması `kordinamik_schema.sql` dosyasında yer alır.

## Gereksinimler

- Node.js v18+
- PostgreSQL 14+
- npm

## Kurulum

Her klasörde ayrı ayrı:

```bash
cd kordinamik-admin && npm install
cd ../kordinamik-admin-panel && npm install
cd ../kordinamik && npm install
cd ../kordinamik-garanti && npm install
```

### Veritabanı

```bash
createdb kordinamik_admin
psql -d kordinamik_admin -f kordinamik_schema.sql
```

### Ortam değişkenleri

`kordinamik-admin/.env` dosyası oluştur (repoda yer almaz, `.gitignore` ile hariç tutulur):

```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3002
GUARANTEE_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=5432
DB_NAME=kordinamik_admin
DB_USER=postgres
DB_PASSWORD=your_password_here

ACCESS_TOKEN_SECRET=change_this_secret
REFRESH_TOKEN_SECRET=change_this_secret
ACCESS_TOKEN_EXPIRY=30m
REFRESH_TOKEN_EXPIRY=7d
BCRYPT_SALT_ROUNDS=12
```

## Çalıştırma

4 ayrı terminalde:

```bash
# Backend API
cd kordinamik-admin && npm start

# Admin Panel
cd kordinamik-admin-panel && PORT=3002 npm start

# Ana Site
cd kordinamik && npm start

# Garanti Formu
cd kordinamik-garanti && npm run dev
```

Backend ayakta mı kontrol etmek için: `http://localhost:3001/health`

Detaylı API endpoint listesi için `kordinamik-admin/README.md` dosyasına bakılabilir.
