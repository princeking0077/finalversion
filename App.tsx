
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { Dashboard } from './pages/Dashboard';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Legal } from './pages/Legal';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Payment } from './pages/Payment';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TestPlayer } from './pages/TestPlayer';
import { NotFound } from './pages/NotFound';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Website Layout (With Header & Footer) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="legal/:policy" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Standalone Pages (No Header/Footer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/test/:testId" element={<TestPlayer />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

// Helper to scroll to top on route change
function ScrollToTop() {
  const { pathname } = React.useMemo(() => window.location, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default App;
