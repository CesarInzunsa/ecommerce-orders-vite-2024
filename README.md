# ecommerce-vite-2024
This project is an ecommerce website developed with Vite and React. The main objective is to demonstrate the knowledge acquired in the use of Vite, React, React Router, and the Material-UI (MUI) library. The project focuses on order management within the context of an ecommerce, covering essential functionalities to visualize and manage purchase orders.

## Description
The "ecommerce-vite-2024" project consists of five main pages, although this repository specifically focuses on the functionality of orders (orders). The other mentioned pages are outside the scope of this project:
- Orders
- Payments
- Prices
- Products
- Shippings

## Implemented Pages
1. Orders: Main page where you can visualize and manage the purchase orders made by users.
2. Products: This page was implemented in another repository and is found at the following link: [ecommerce-vite-2023](https://github.com/CesarInzunsa/ecommerce-vite-2023)

## Technologies Used
- Vite: As a build and development tool.
- React: For the creation of components and management of the application's state.
- React Router: For navigation between the different pages of the site.
- Material-UI (MUI): User interface components library.
- JavaScript APIs: For interaction with the backend.
- Mongoose: For data modeling in MongoDB.
- MongoDB: NoSQL database used to store information.

## Backend
The backend of this project is located in the ecommerce-orders-api-2024 repository. Make sure to clone and configure the backend following the instructions in its respective README so that the frontend application can interact correctly with the API.

## Installation and Configuration
Follow these steps to configure and run the project on your local machine:

1. Clone this repository:

```bash
git clone https://github.com/cesarinzunsa/ecommerce-orders-vite-2024.git
cd ecommerce-orders-vite-2024
```

2. Install the dependencies
```bash
npm install
```

3. Configure the necessary environment variables to connect with the backend (ecommerce-orders-api-2024). Create a .env file at the root of the project and add the following variables:
```
VITE_API_ORDERS_URL=http://localhost:3020/api/pwa/orders
VITE_API_LABELS_URL=http://localhost:3020/api/pwa/labels
VITE_API_PERSONS_URL=http://localhost:3020/api/pwa/persons
VITE_API_INSTITUTES_URL=http://localhost:3020/api/pwa/institutes
VITE_API_PRODUCTOS_URL=http://localhost:3020/api/pwa/cat-prod-serv
```

4. Start the development server
```bash
npm run dev
```