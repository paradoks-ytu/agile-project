import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLayout from './app/admin/layout';
import ClubRegistrationPage from './app/admin/register/page';
import DashboardPage from './app/admin/dashboard/page';
import LandingPage from './app/landing/page';
import LoginPage from './app/auth/login/page';
import ProfilePage from './app/profile/page';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/myprofile" element={<ProfilePage />} />

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
