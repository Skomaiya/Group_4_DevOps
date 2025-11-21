import axiosClient from "./axiosClient";

export const fetchCourses = (params) => axiosClient.get("courses/", { params });
export const fetchCourse = (id) => axiosClient.get(`courses/${id}/`);
export const fetchLessons = (courseId) =>
  axiosClient.get(`lessons/`, { params: { course: courseId } });
export const fetchLesson = (id) => axiosClient.get(`lessons/${id}/`);

// Enrollment APIs
export const enrollCourse = (courseId) =>
  axiosClient.post("enrollments/", { course: courseId });
export const fetchEnrollments = () => axiosClient.get("enrollments/");
export const fetchEnrollment = (id) => axiosClient.get(`enrollments/${id}/`);
export const updateEnrollmentProgress = (id, progress) =>
  axiosClient.patch(`enrollments/${id}/`, { progress_percentage: progress });
