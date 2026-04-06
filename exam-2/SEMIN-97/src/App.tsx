import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TimelinePage from '@/pages/TimelinePage.tsx'
import NewReservationPage from '@/pages/NewReservationPage.tsx'
import ReservationDetailPage from '@/pages/ReservationDetailPage.tsx'
import MyReservationsPage from '@/pages/MyReservationsPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TimelinePage />} />
        <Route path="/reservations/new" element={<NewReservationPage />} />
        <Route path="/reservations/:id" element={<ReservationDetailPage />} />
        <Route path="/my-reservations" element={<MyReservationsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
