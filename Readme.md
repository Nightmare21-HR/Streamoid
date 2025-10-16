# Product Catalog API

A simple backend service for managing a product catalog using a CSV upload. It allows users to upload product data, validate it, and store it in a SQLite database. The API also supports listing products with pagination and searching/filtering by brand, color, and price range.

Built with **Node.js**, **Express**, and **Knex.js**.

---

##  Tech Stack

* **Backend**: Node.js, Express.js
* **Database**: SQLite with Knex.js query builder
* **File Handling**: Multer (for uploads), csv-parser

---

## Setup and Installation

### Prerequisites
* Node.js **v16+**
* npm (comes with Node.js)

### Installation Steps

1.  **Clone the repository** (replace with your actual URL):
    ```bash
    git clone [https://github.com/Nightmare21-HR/Streamoid.git](https://github.com/Nightmare21-HR/Streamoid.git)
    ```

2.  **Navigate to the project folder**:
    ```bash
    cd Streamoid
    ```

3.  **Install dependencies**:
    ```bash
    npm install
    ```
---

## Running the Application

* **Development Mode** (with auto-restart):
    ```bash
    npm run dev
    ```

* **Production Mode**:
    ```bash
    npm start
    ```

The server will be running at `http://localhost:8000`.

---

## API Documentation

### 1. Upload Products CSV
Uploads a CSV file, validates each row, and stores valid products in the database.

* **Endpoint**: `POST /upload`
* **Request Body**: `multipart/form-data` with a `file` key containing the CSV file.
* **Validation Rules**:
    * `price` must be ≤ `mrp`.
    * `quantity` must be ≥ 0.
    * Required fields: `sku`, `name`, `brand`, `mrp`, `price`, `quantity`.
    * Duplicate SKUs are ignored and reported.

    **Sample Request (`curl`):**
    ```bash
    curl -X POST -F "file=@products.csv" http://localhost:8000/upload
    ```
    **Sample Response:**
    ```json
    {
      "stored": 20,
      "failed": [
        {
          "row": 22,
          "sku": "HOODIE-CRM-A",
          "error": "Price cannot be greater than MRP."
        },
        {
          "row": 23,
          "sku": "HOODIE-CRM-B",
          "error": "Quantity cannot be negative."
        },
        {
          "row": 24,
          "sku": "SHIRT-PLN-L",
          "error": "SKU already exists"
        }
      ]
    }
    ```

### 2. List All Products
Retrieves a list of all products from the database with pagination.

* **Endpoint**: `GET /products`
* **Query Parameters**:
    * `page` (optional): The page number. Default: `1`.
    * `limit` (optional): The number of items per page. Default: `10`.

    **Sample Request:**
    ```
    GET http://localhost:8000/products?page=1&limit=3
    ```
    **Sample Response:**
    ```json
    [
      {
        "id": 1,
        "sku": "TSHIRT-RED-001",
        "name": "Classic Cotton T-Shirt",
        "brand": "StreamThreads",
        "mrp": 799,
        "price": 499,
        "quantity": 20,
        "color": "Red",
        "size": "M"
      },
      {
        "id": 2,
        "sku": "TSHIRT-BLK-002",
        "name": "Classic Cotton T-Shirt",
        "brand": "StreamThreads",
        "mrp": 799,
        "price": 549,
        "quantity": 12,
        "color": "Black",
        "size": "L"
      },
      {
        "id": 3,
        "sku": "POLO-GRN-003",
        "name": "Heritage Polo",
        "brand": "StreamThreads",
        "mrp": 1299,
        "price": 999,
        "quantity": 8,
        "color": "Green",
        "size": "XL"
      }
    ]
    ```

### 3. Search Products
Searches for products using filter criteria.

* **Endpoint**: `GET /products/search`
* **Query Parameters**:
    * `brand` (optional): Filter by brand name.
    * `color` (optional): Filter by color.
    * `minPrice` (optional): Filter by minimum price.
    * `maxPrice` (optional): Filter by maximum price.

    **Sample Request:**
    ```
    GET http://localhost:8000/products/search?brand=BloomWear&maxPrice=2500
    ```
    **Sample Response:**
    ```json
    [
      {
        "id": 6,
        "sku": "DRESS-PNK-S",
        "name": "Floral Summer Dress",
        "brand": "BloomWear",
        "mrp": 2499,
        "price": 2199,
        "quantity": 10,
        "color": "Pink",
        "size": "S"
      },
      {
        "id": 7,
        "sku": "DRESS-YLW-M",
        "name": "Floral Summer Dress",
        "brand": "BloomWear",
        "mrp": 2499,
        "price": 1999,
        "quantity": 7,
        "color": "Yellow",
        "size": "M"
      }
    ]
    ```
---

##  Database Schema

| Column     | Type                                  | Description            |
| ---------- | ------------------------------------- | ---------------------- |
| `id`       | INTEGER (Primary Key, Auto Increment) | Unique ID              |
| `sku`      | TEXT (Unique)                         | Product SKU            |
| `name`     | TEXT                                  | Product name           |
| `brand`    | TEXT                                  | Product brand          |
| `color`    | TEXT                                  | Product color          |
| `size`     | TEXT                                  | Product size           |
| `mrp`      | REAL                                  | Maximum Retail Price   |
| `price`    | REAL                                  | Selling Price          |
| `quantity` | INTEGER                               | Available quantity     |