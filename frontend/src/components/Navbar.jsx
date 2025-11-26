import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'


export default function Navbar(){
const user = useAuthStore(s => s.user)
const logout = useAuthStore(s => s.logout)
const navigate = useNavigate()


const onLogout = () => { logout(); navigate('/login') }


return (
<nav className="bg-white shadow p-4 flex justify-between items-center">
<div className="font-bold text-lg">LearnHub</div>
<div className="space-x-4">
<Link to="/courses" className="hover:underline">Courses</Link>
{user ? (
<>
<Link to="/dashboard" className="hover:underline">Dashboard</Link>
{user.role === 'instructor' && (
<Link to="/courses/create" className="hover:underline">Create Course</Link>
)}
<Link to="/profile" className="hover:underline">Profile</Link>
<button onClick={onLogout} className="ml-2 px-3 py-1 rounded border">Logout</button>
</>
) : (
<>
<Link to="/login" className="ml-2">Login</Link>
<Link to="/register" className="ml-2">Register</Link>
</>
)}
</div>
</nav>
)
}