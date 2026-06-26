# 🏍️ TondarMotor – Backend API

 **From "learning backend" to "real interaction"** – A RESTful backend API for a motorcycle marketplace built with Node.js, Express, and MongoDB.

---

## What this is (and what it isn't)

**TondarMotor** is a RESTful API for a motorcycle marketplace. It handles products, articles, authentication, and admin controls.  

Unlike my previous project (`SabzCourse`), which was purely for practicing backend concepts, this one was built with a **real frontend in mind**. I designed the endpoints, error responses, and data flow so that a frontend developer could actually use them.

**What it isn't:**
- It's **not** a full-stack project – the frontend is separate (and not all pages were mine to design).
- It **doesn't** include real product images – those are stored on a cloud service. Only URLs are in the database.
- It's **not** finished – but it's a solid backend .

---

## ✨ Key Features

- **JWT Authentication** – Register, login, and protected routes with role-based access (user/admin).
- **Product Management** – Full CRUD with **search, filtering, and categorization**.
- **Article System** – Blog-like articles with cover images.
- **User Ban System** – Admins can ban/unban users.
- **MVC Architecture** – Clean separation of concerns.
- **Multer for file uploads** – Images are uploaded from the frontend, stored on the server, and the URLs are saved in the database.

---

## 🛠 Tech Stack (and why I used them)

- **Node.js + Express** – For building RESTful endpoints that the frontend could easily call.
- **MongoDB + Mongoose** – For flexible data modeling and relationships.
- **JWT + bcrypt** – For authentication.
- **multer** – For handling multipart file uploads.

---

## 🚀 Main Capabilities

### Authentication
- Register / Login
- JWT token generation and validation
- Role-based access (user/admin)

### Products
- Create, update, delete products
- Search and filter products
- Product categorization and branding

### Articles
- Create, update, delete articles
- Retrieve articles with pagination

### Administration
- User management (ban/unban)
- Banner management
- Content moderation

---

## 🎯 What I learned from this project (that I didn't know before)

- **How to design APIs for a real frontend** – not just functional, but predictable and easy to use.
- **How to handle file uploads from a frontend** – the complete flow from receiving the file to saving the URL.
- **How to debug CORS issues** when the frontend and backend are on different origins.
- **How to communicate with a frontend developer** – understanding their needs and adjusting the API accordingly.
- **How to test endpoints with Postman** before the frontend was even ready.

> 💡 **What made this project different for me:** This time, I had to think about how the frontend would consume the API – pagination, error messages, consistent responses.

---

## 📌 Future Improvements

- Unit and integration testing (Jest)
- Docker support
- API documentation with Swagger
- Redis caching
- Rate limiting
- CI/CD pipeline

---

*This is a learning project, but I treat it like a real one. Feedback is always welcome.*
