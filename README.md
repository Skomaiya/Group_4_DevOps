# LearnHub - Lightweight Learning Management System (LMS)
> Your gateway to simplified online education and hands-on DevOps deployment.


## Team Members
Mukunzi Patrick  Frontend Developer

Samuel Komaiya  Backend Developer

Plamedi mayala Backend Developer

## 🧭 Overview
LearnHub is a modern, minimal Learning Management System designed to deliver an efficient and scalable online learning experience.

Built with React (TypeScript) and Django (PostgreSQL), it allows students to browse and enroll in courses while instructors can create and manage course content.
The main goal of this project is to design, develop, and deploy a functional, production-ready LMS while implementing DevOps practices such as CI/CD pipelines, containerization, and cloud deployment.

## 🎯 Project Objectives
* Build a functional and minimal LMS with authentication, role-based access, and core course features.
* Implement DevOps pipelines for continuous integration and deployment.
* Deploy the full-stack application to a cloud environment (e.g., AWS, Azure, or Render).
* Ensure scalability, maintainability, and reliability through good architectural practices.

## 👥 User Roles
### Students
* Register, log in, and manage profile.
* Browse available courses and enroll.
* Take course lessons and quizzes.
* Track course completion progress.

### Instructors
* Create, edit, and publish courses.
* Upload lessons (text, video links).
* Manage student enrollments.
* View student progress and submissions.

## ⚙️ Core Features (MVP Scope)

| Category | Features |
| :--- | :--- |
| *Authentication* | Django-based user registration & JWT authentication. Role-based access (Student/Instructor). |
| *Course Management* | Instructors can create, edit, and delete their own courses. |
| *Enrollment System* | Students can browse and enroll in published courses. |
| *Lesson Management* | Each course can have multiple lessons (text or video). |
| *Quizzes (Optional)* | Simple quiz functionality (multiple-choice). |
| *User Dashboard* | Track enrolled courses and progress. |
| *Responsive UI* | Modern, responsive interface built with TailwindCSS. |

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
* *Frontend* → Hosted on Netlify / Vercel
* *Backend* → Hosted on Render / Railway / AWS EC2
* *Database* → PostgreSQL (managed service)
* *CI/CD* → GitHub Actions automated pipeline

## 🧪 Planned DevOps Implementations

| Tool | Purpose |
| :--- | :--- |
| *Docker* | Containerize frontend and backend services |
| *Docker Compose* | Manage multi-container setup |
| *GitHub Actions* | Build, test, and deploy automatically |
| *Environment Variables* | Secure configuration handling |
| *Cloud Deployment* | Deploy containers to Render, Railway, or AWS |

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
    ├── api/
│   ├── manage.py
│   └── requirements.txt