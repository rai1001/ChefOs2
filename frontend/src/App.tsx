import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/login-page';
import RegisterPage from './pages/auth/register-page';
import { ProtectedRoute } from './components/protected-route';
import { DashboardLayout } from './components/layout/dashboard-layout';
import IngredientsPage from './pages/inventory/ingredients-page';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background text-foreground font-sans antialiased">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<DashboardLayout />}>
                            <Route path="/" element={<div className="p-4">Overview Dashboard (Coming Soon)</div>} />
                            <Route path="/ingredients" element={<IngredientsPage />} />
                        </Route>
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
