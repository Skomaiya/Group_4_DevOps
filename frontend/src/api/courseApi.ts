import axiosClient from './axiosClient'


export const fetchCourses = (params) => axiosClient.get('courses/', { params })
export const fetchCourse = (id) => axiosClient.get(`courses/${id}/`)