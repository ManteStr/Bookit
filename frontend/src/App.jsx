import { Route, Routes } from 'react-router-dom'
import { AuthLayout } from './components/layouts/AuthLayout.jsx'
import { MainLayout } from './components/layouts/MainLayout.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import HomePage from './pages/HomePage.jsx'
import MapPage from './pages/MapPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import RoomDetailPage from './pages/RoomDetailPage.jsx'
import RoomsPage from './pages/RoomsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/kambariai" element={<RoomsPage />} />
        <Route path="/kambariai/:id" element={<RoomDetailPage />} />
        <Route path="/zemelapis" element={<MapPage />} />
        <Route path="/kalendorius" element={<CalendarPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/prisijungti" element={<LoginPage />} />
        <Route path="/registruotis" element={<RegisterPage />} />
      </Route>
    </Routes>
  )
}
