import axiosClient from "./axiosClient";

// Course APIs
export const fetchCourses = (params) => axiosClient.get("courses/", { params });
export const fetchCourse = (id) => axiosClient.get(`courses/${id}/`);
export const createCourse = (data) => axiosClient.post("courses/", data);
export const updateCourse = (id, data) => axiosClient.patch(`courses/${id}/`, data);
export const deleteCourse = (id) => axiosClient.delete(`courses/${id}/`);
export const getCourseStudents = (courseId) => axiosClient.get(`courses/${courseId}/my_students/`);

// Lesson APIs
export const fetchLessons = (courseId) =>
  axiosClient.get(`lessons/`, { params: { course: courseId } });
export const fetchLesson = (id) => axiosClient.get(`lessons/${id}/`);
export const createLesson = (data) => axiosClient.post("lessons/", data);
export const updateLesson = (id, data) => axiosClient.patch(`lessons/${id}/`, data);
export const deleteLesson = (id) => axiosClient.delete(`lessons/${id}/`);

// Enrollment APIs
export const enrollCourse = (courseId) =>
  axiosClient.post("enrollments/", { course: courseId });
export const fetchEnrollments = () => axiosClient.get("enrollments/");
export const fetchEnrollment = (id) => axiosClient.get(`enrollments/${id}/`);
export const updateEnrollmentProgress = (id, progress) =>
  axiosClient.patch(`enrollments/${id}/`, { progress_percentage: progress });
