import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-background text-foreground">
                <Routes>
                    <Route path="/" element={
                        <div className="flex flex-col items-center justify-center h-screen space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight text-primary">ChefOS</h1>
                            <p className="text-muted-foreground">Operating System for Professional Kitchens</p>
                        </div>
                    } />
                    {/* <Route path="/login" element={<LoginPage />} /> */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
