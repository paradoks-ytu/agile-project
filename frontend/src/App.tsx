import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './app/admin/layout';
import ClubRegistrationPage from './app/admin/register/page';
import DashboardPage from './app/admin/dashboard/page';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect root to admin panel dashboard */}
                <Route path="/" element={<Navigate to="/admin/panel" replace />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                    {/* Dashboard */}
                    <Route path="panel" element={<DashboardPage />} />

                    {/* Clubs */}
                    <Route path="clubs/register" element={<ClubRegistrationPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
