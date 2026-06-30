# Kordinamik

Kordinamik için ana site, bayi/admin yönetim sistemi ve garanti kayıt uygulamalarını içeren monorepo.

## Proje Yapısı

| Klasör | Açıklama | Stack | Port |
|---|---|---|---|
| `kordinamik-admin` | Backend API (auth, ürünler, bayiler, siparişler, garanti) | Node.js + Express + PostgreSQL (Sequelize) | 3001 |
| `kordinamik-admin-panel` | Admin yönetim paneli arayüzü | React | 3002 |
| `kordinamik` | Ana site / bayi portalı | React | 3000 |
| `kordinamik-garanti` | Ürün garanti kayıt formu | React + Vite | 5173 |


## Gereksinimler

- Node.js v18+
- PostgreSQL 14+
- npm



