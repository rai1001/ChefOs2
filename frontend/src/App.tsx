import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/login-page';
import RegisterPage from './pages/auth/register-page';
import { ProtectedRoute } from './components/protected-route';

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
                        <Route path="/" element={
                            <div className="flex flex-col items-center justify-center h-screen space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight text-primary">ChefOS Dashboard</h1>
                                <p className="text-muted-foreground">Welcome to your kitchen operating system.</p>
                            </div>
                        } />
                    </Route>

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
