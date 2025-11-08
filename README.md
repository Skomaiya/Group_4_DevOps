# LearnHub - A Lightweight African Learning Platform
> A data-efficient LMS designed for and by African students, built to practice production-level DevOps.

## Team Members
* Mukunzi Patrick (Frontend Developer)
* Samuel Komaiya (Backend Developer)
* Plamedi Mayala (Backend Developer)

## 🧭 Overview
LearnHub is a lightweight, mobile-first Learning Management System (LMS) built to address the unique challenges of university and secondary students across Africa.

### The Problem (African Context)
In many African educational institutions, students face significant barriers to digital learning. These include:
1.  **High Data Costs:** Internet access is expensive, making it difficult to stream video-heavy courses or download large files.
2.  **Scattered Resources:** Critical study materials like past exam papers, lecture notes, and study guides are often scattered across making them hard to find, track, and access.

### Our Solution & Value Proposition
LearnHub tackles this by providing a **central, data-efficient, and accessible platform**.

It is *intentionally* minimal, ensuring it is fast and consumes less data, making it ideal for low-bandwidth mobile connections. Our value proposition is **accessible education**:
* **For Students:** A "single source of truth" to find courses without high data usage.
* **For Instructors:** A simple way to upload content (text, video links).

### Project Goal (DevOps Course)
While the application is a functional LMS, its primary purpose in this course is to serve as a real-world workload for a robust DevOps implementation. The main goal is to design, develop, and deploy this production-ready application while mastering CI/CD, containerization, and cloud deployment practices.

## 🎯 Project Objectives
* Build a functional and minimal LMS that addresses the core problem of resource accessibility for African students.
* Implement role-based access for the two key user groups (Students and Instructors).
* Implement a full DevOps pipeline for continuous integration and deployment.
* Deploy the containerized, full-stack application to a cloud environment (e.g., AWS, Render).
* Ensure the final product is scalable, maintainable, and reliable.

## 👥 Target Users

### Students
* **Who:** University or senior secondary students in an African context (e.g., Nigeria, Kenya, Rwanda).
* **Needs:** A low-cost, easy-to-access, and reliable way to find localized study materials, course notes, and past papers.
* **Features:**
    * Register, log in, and manage a simple profile.
    * Browse available courses and enroll.
    * Access course lessons (text, video links) and download resources.
    * Track course completion progress.

### Instructors
* **Who:** University lecturers, teaching assistants (TAs), or even student tutors running study groups.
* **Needs:** A simple, fast way to upload materials and communicate with their students without a complex interface.
* **Features:**
    * Create, edit, and publish courses.
    * Upload lessons (text and videos links).
    * Manage student enrollments for their courses.
    * View student progress and submissions.

## ⚙️ Core Features (MVP Scope)

| Category | Features |
| :--- | :--- |
| **Authentication** | Django-based user registration & JWT authentication. Role-based access (Student/Instructor). |
| **Course Management** | Instructors can create, edit, and delete their own courses. |
| **Enrollment System** | Students can browse and enroll in published courses. |
| **Lesson Management** | Each course can have multiple lessons (text or video). |
| **Quizzes (Optional)** | Simple quiz functionality (multiple-choice). |
| **User Dashboard** | Track enrolled courses and progress. |
| **Responsive UI** | Modern, responsive interface built with TailwindCSS. |

## 🧩 Technology Stack
### Frontend
* React 18 + TypeScript
* Vite (fast build tool)
* Tailwind CSS for styling
* Axios for API requests
* React Router v6 for navigation
* React Context for authentication
* Redux Toolkit for course filtering and state management

### Backend
* Django REST Framework (Python)
* PostgreSQL database
* JWT Authentication via djangorestframework-simplejwt
* Docker for containerization

### DevOps & Deployment
* GitHub Actions for CI/CD pipelines
* Docker Compose for service orchestration
* AWS / Render / Railway for deployment
* Nginx as reverse proxy (optional)
* Environment variables for configuration management

## 🧱 High-Level Architecture
Deployed as:
* **Frontend** → Hosted on Netlify / Vercel
* **Backend** → Hosted on Render / Railway / AWS EC2
* **Database** → PostgreSQL (managed service)
* **CI/CD** → GitHub Actions automated pipeline

## 🧪 Planned DevOps Implementations

| Tool | Purpose |
| :--- | :--- |
| **Docker** | Containerize frontend and backend services |
| **Docker Compose** | Manage multi-container setup |
| **GitHub Actions** | Build, test, and deploy automatically |
| **Environment Variables** | Secure configuration handling |
| **Cloud Deployment** | Deploy containers to Render, Railway, or AWS |

## 🧰 Project Structure

```bash
learnhub/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── redux/
│   │   └── App.tsx
│   ├── index.html
│   └── tailwind.config.js
│
├── backend/
│   ├── learnhub_api/
│   ├── api/
│   ├── manage.py
│   └── requirements.txt
│
├── Dockerfile
├── docker-compose.yml
└── .dockerignore
```

## 🐳 Running with Docker Compose

This project is containerized using Docker and Docker Compose for easy local development and deployment.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (version 20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0 or higher)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Skomaiya/Group_4_DevOps.git
   cd Group_4_DevOps
   ```

2. **Start the services:**
   ```bash
   docker-compose up --build
   ```
   
   This command will:
   - Build the Django backend image
   - Start PostgreSQL database
   - Run database migrations
   - Start the Django development server

3. **Access the application:**
   - Backend API: http://localhost:8000/api
   - API Documentation: http://localhost:8000/api/schema/swagger-ui/
   - Admin Panel: http://localhost:8000/admin/

### Docker Compose Commands

```bash
# Start services in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop services and remove volumes (⚠️ deletes database data)
docker-compose down -v

# Rebuild containers after code changes
docker-compose up --build

# Run Django management commands
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
docker-compose exec web python manage.py collectstatic
```

### Environment Variables

The `docker-compose.yml` file includes default environment variables. For production, create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DB_ENGINE=django.db.backends.postgresql
DB_NAME=learnhub_db
DB_USER=myuser
DB_PASSWORD=your-secure-password
DB_HOST=db
DB_PORT=5432
```

### Database Migrations

After starting the containers for the first time, run migrations:

```bash
docker-compose exec web python manage.py migrate
```

### Creating a Superuser

To access the Django admin panel:

```bash
docker-compose exec web python manage.py createsuperuser
```

### Dockerfile Features

- **Base Image:** `python:3.11-slim` for a lightweight container
- **Security:** Runs as non-root user (`appuser`)
- **Optimization:** Multi-stage build cache for faster rebuilds
- **PostgreSQL Client:** Included for database connections

### Troubleshooting

**Port already in use:**
```bash
# Change the port mapping in docker-compose.yml
ports:
  - "8000:8000"
```