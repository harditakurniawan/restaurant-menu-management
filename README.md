# 🍽️ Hungry Hub -- Restaurant Menu Management API

A simple CRUD REST API for managing restaurants and their menu items.

Built using **NestJS** with **PostgreSQL**, fully dockerized for easy
local development.

------------------------------------------------------------------------

## 🚀 Tech Stack

-   NestJS v10.3.9
-   PostgreSQL v17.9
-   Docker

------------------------------------------------------------------------

## 📦 Features

-   Restaurant CRUD
-   Menu Item CRUD
-   Category List
-   Role & Permission Seeder
-   Swagger API Documentation
-   Dockerized Environment

------------------------------------------------------------------------

# ⚙️ Installation Guide

------------------------------------------------------------------------

## 🖥️ Run Without Docker (Local Setup)

### 1️⃣ Setup Environment Variables

``` bash
cp .env.example .env
```

------------------------------------------------------------------------

### 2️⃣ Install Dependencies

``` bash
npm install
```

------------------------------------------------------------------------

### 3️⃣ Create Logs Directory

``` bash
mkdir logs
```

------------------------------------------------------------------------

### 4️⃣ Run Database Seeders

``` bash
npm run seed create:permission && npm run seed create:role && npm run seed create:role-permission && npm run seed create:admin && npm run seed create:category && npm run seed create:restaurant && npm run seed create:menu-item
```

------------------------------------------------------------------------

### 5️⃣ View Application Logs

``` bash
npm run start:dev
```

------------------------------------------------------------------------

### 6️⃣ View Application Logs

``` bash
tail -f logs/main.log
```

------------------------------------------------------------------------

# 🐳 Run Using Docker

### 1️⃣ Build & Start Container

``` bash
docker compose up
```

(Use `-d` if you want detached mode)

------------------------------------------------------------------------

### 2️⃣ Run Seeders

``` bash
npm run seed create:permission && npm run seed create:role && npm run seed create:role-permission && npm run seed create:admin && npm run seed create:category && npm run seed create:restaurant && npm run seed create:menu-item
```

------------------------------------------------------------------------

### 3️⃣ View Logs Inside Container

``` bash
docker exec -it <container_name> tail -f /app/logs/main.log
```

------------------------------------------------------------------------

# 📚 API Documentation

## 🔹 Swagger

http://127.0.0.1:3003/swagger

------------------------------------------------------------------------

## 🔹 Postman Collection

Import the file:

Hungry Hub - API Doc.postman_collection.json

------------------------------------------------------------------------

# 🧪 Default Server

By default, the application runs on:

local  : http://127.0.0.1:4000

vps    : http://38.242.193.144:4000

------------------------------------------------------------------------

# 📝 Notes

-   Make sure PostgreSQL is running before starting the application (for
    non-docker setup).
-   Ensure your `.env` configuration matches your database credentials.
-   Run seeders after the database is successfully connected.

------------------------------------------------------------------------
