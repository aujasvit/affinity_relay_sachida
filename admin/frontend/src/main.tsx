import ReactDOM from 'react-dom/client'
import './index.css'
import LoginPage from './pages/login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminPage from './pages/AdminPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/admin/home" element={<ProtectedRoute userType={"admin"} comp={<AdminPage />}/> } /> */}
            <Route path="/admin/home" element={<AdminPage/> } />
        </Routes>
    </BrowserRouter>
)
