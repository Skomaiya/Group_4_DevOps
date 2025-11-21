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

---

## 🧪 CI/CD Status

![CI Pipeline](https://github.com/Skomaiya/Group_4_DevOps/actions/workflows/ci.yml/badge.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Docker](https://img.shields.io/badge/docker-enabled-blue)

> **Note:** Replace `Skomaiya/Group_4_DevOps` with your actual GitHub username/organization and repository name.

---

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

2. **Start all services:**
   ```bash
   docker-compose up --build
   ```
   
   This command will:
   - Build the Django backend image
   - Start PostgreSQL database
   - Run database migrations
   - Start the Django development server on port 8000

3. **Access the application:**
   - **Backend API:** http://localhost:8000/api
   - **API Documentation (Swagger):** http://localhost:8000/api/schema/swagger-ui/
   - **API Documentation (ReDoc):** http://localhost:8000/api/schema/redoc/
   - **Admin Panel:** http://localhost:8000/admin/

---

## 💻 Local Development (Without Docker)

For development without Docker:

```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Set environment variables
export DJANGO_SETTINGS_MODULE=learnhub_api.settings
export SECRET_KEY=your-dev-secret-key
export DEBUG=True

# Run migrations
python backend/manage.py migrate

# Create a superuser (optional)
python backend/manage.py createsuperuser

# Start development server
python backend/manage.py runserver
```

The API will be available at http://localhost:8000/api

---

## 🧪 Testing & Code Quality

### Run Linting

Ensure code quality with flake8:

```bash
# Install flake8 if not already installed
pip install flake8

# Run linting on the entire project
flake8 backend/

# Run with specific configuration
flake8 backend/ --max-line-length=120 --exclude=migrations,__pycache__
```

### Run Tests

Execute the Django test suite:

```bash
# Run all tests
python backend/manage.py test --noinput

# Run tests with coverage
coverage run --source='backend' backend/manage.py test --noinput
coverage report

# Run specific test module
python backend/manage.py test api.tests.test_authentication

# Run tests in Docker
docker-compose exec web python manage.py test --noinput
```

### Pre-commit Checklist

Before pushing code, ensure:
- [ ] All tests pass: `python backend/manage.py test --noinput`
- [ ] Code passes linting: `flake8 backend/`
- [ ] Migrations are created: `python backend/manage.py makemigrations --check`
- [ ] No security issues: `python backend/manage.py check --deploy`
- [ ] Docker build succeeds: `docker-compose build`

---

## 🔧 Docker Compose Commands

```bash
# Start services in detached mode (background)
docker-compose up -d

# View real-time logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f web

# Stop services
docker-compose down

# Stop services and remove volumes (⚠️ deletes database data)
docker-compose down -v

# Rebuild containers after code changes
docker-compose up --build

# Restart a specific service
docker-compose restart web

# Run Django management commands
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py createsuperuser
docker-compose exec web python manage.py collectstatic --noinput
docker-compose exec web python manage.py shell

# Access PostgreSQL database
docker-compose exec db psql -U myuser -d learnhub_db

# View running containers
docker-compose ps
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root for local development:

```env
# Django Settings
SECRET_KEY=your-secret-key-here-minimum-50-characters
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_ENGINE=django.db.backends.postgresql
DB_NAME=learnhub_db
DB_USER=myuser
DB_PASSWORD=your-secure-password
DB_HOST=db
DB_PORT=5432

# JWT Settings
JWT_EXPIRATION_HOURS=24

# Email Configuration (optional)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

> **Security Note:** Never commit `.env` files to version control. The `.env` file is included in `.gitignore`.

---

## 🚀 CI/CD Pipeline

Our GitHub Actions workflow automatically:

1. **Linting:** Runs flake8 to check code quality
2. **Testing:** Executes all Django tests
3. **Docker Build:** Validates Dockerfile and builds images
4. **Security Checks:** Runs Django security checks
5. **Deployment:** (Coming soon) Auto-deploy to production on merge to `main`

### Trigger CI Pipeline

The pipeline runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main`
- Manual workflow dispatch

### View Pipeline Status

Check the status of your CI/CD pipeline:
- Visit: https://github.com/Skomaiya/Group_4_DevOps/actions
- Look for the green checkmark ✅ or red X ❌

---

## 🗄️ Database Migrations

### Create New Migrations

After modifying models:

```bash
# Using Docker
docker-compose exec web python manage.py makemigrations

# Without Docker
python backend/manage.py makemigrations
```

### Apply Migrations

```bash
# Using Docker
docker-compose exec web python manage.py migrate

# Without Docker
python backend/manage.py migrate
```

### View Migration Status

```bash
docker-compose exec web python manage.py showmigrations
```

---

## 🔍 Troubleshooting

### Port Already in Use

If port 8000 is already in use:

```bash
# Option 1: Stop the conflicting process
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000   # Windows

# Option 2: Change port in docker-compose.yml
ports:
  - "8001:8000"  # Use port 8001 instead
```

### Database Connection Issues

```bash
# Recreate database container
docker-compose down -v
docker-compose up -d db
docker-compose exec web python manage.py migrate
```

### Container Build Failures

```bash
# Clear Docker cache and rebuild
docker-compose down
docker system prune -af
docker-compose build --no-cache
docker-compose up
```

### Permission Errors

```bash
# Fix file permissions (Linux/macOS)
sudo chown -R $USER:$USER .

# Run as root in container (not recommended for production)
docker-compose exec --user root web bash
```

---

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 📝 DevOps Evidence Checklist

Use this checklist to track your DevOps implementation progress:

- [ ] **Version Control**
  - [ ] Repository initialized with meaningful commits
  - [ ] `.gitignore` configured properly
  - [ ] Branch protection rules enabled on `main`

- [ ] **Containerization**
  - [ ] Dockerfile created and optimized
  - [ ] docker-compose.yml configured
  - [ ] Multi-stage builds implemented (if applicable)
  - [ ] Non-root user configured in container

- [ ] **CI/CD Pipeline**
  - [ ] GitHub Actions workflow file created
  - [ ] Automated testing on push/PR
  - [ ] Linting integrated
  - [ ] Build status badge in README

- [ ] **Testing**
  - [ ] Unit tests written for models
  - [ ] API endpoint tests implemented
  - [ ] Test coverage > 70%
  - [ ] Tests run in CI pipeline

- [ ] **Security**
  - [ ] Secrets managed via environment variables
  - [ ] `.env` file in `.gitignore`
  - [ ] Django security checks pass
  - [ ] Dependencies scanned for vulnerabilities

- [ ] **Documentation**
  - [ ] README with setup instructions
  - [ ] API documentation (Swagger/ReDoc)
  - [ ] Code comments where necessary
  - [ ] Architecture diagram

- [ ] **Deployment**
  - [ ] Application deployed to cloud platform
  - [ ] Environment variables configured in production
  - [ ] Database migrations run successfully
  - [ ] Health checks implemented

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Team Contact

For questions or support, reach out to the team:
- **Patrick Mukunzi** - Frontend Development
- **Samuel Komaiya** - Backend Development
- **Plamedi Mayala** - Backend Development

**Repository:** https://github.com/Skomaiya/Group_4_DevOps