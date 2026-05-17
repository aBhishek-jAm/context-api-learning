import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import Courses from './pages/Courses';
import History from './pages/History';
import Notes from './pages/Notes';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { StudentRoute, AdminRoute, PublicRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      <Routes>
        {/* Public routes (redirect to dashboard if already logged in) */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/admin-login" element={<PublicRoute><AdminLogin /></PublicRoute>} />

        {/* Protected student routes */}
        <Route path="/" element={<StudentRoute><Dashboard /></StudentRoute>} />
        <Route path="/discover" element={<StudentRoute><Discover /></StudentRoute>} />
        <Route path="/courses" element={<StudentRoute><Courses /></StudentRoute>} />
        <Route path="/history" element={<StudentRoute><History /></StudentRoute>} />
        <Route path="/notes" element={<StudentRoute><Notes /></StudentRoute>} />
        <Route path="/analytics" element={<StudentRoute><Analytics /></StudentRoute>} />
        <Route path="/profile" element={<StudentRoute><Profile /></StudentRoute>} />

        {/* Protected admin routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </div>
  );
}

export default App;
