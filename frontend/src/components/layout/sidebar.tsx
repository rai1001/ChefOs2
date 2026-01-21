import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Briefcase, LogOut } from 'lucide-react'; // Basic icons
import { useAuthStore } from '@/stores/auth.store';

export function Sidebar() {
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);

    const navItems = [
        { href: '/', label: 'Overview', icon: LayoutDashboard },
        { href: '/ingredients', label: 'Ingredients', icon: Briefcase }, // Briefcase as placeholder for Package/Carrot
    ];

    return (
        <div className="flex flex-col h-full w-64 bg-slate-900 text-white border-r border-slate-800">
            <div className="p-6">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    ChefOS
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                        <Link key={item.href} to={item.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800",
                                    isActive && "bg-slate-800 text-white font-medium"
                                )}
                            >
                                <Icon className="mr-2 h-4 w-4" />
                                {item.label}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </Button>
            </div>
        </div>
    );
}
