import { Sidebar } from './sidebar';
import { Outlet } from 'react-router-dom';

export function DashboardLayout() {
    return (
        <div className="flex h-screen bg-slate-950 text-slate-100">
            <Sidebar />
            <main className="flex-1 overflow-auto p-8">
                <Outlet />
            </main>
        </div>
    );
}
