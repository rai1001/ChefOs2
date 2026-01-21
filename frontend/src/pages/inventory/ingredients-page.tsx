import { useIngredients } from '@/hooks/use-inventory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateIngredientDialog } from '@/components/inventory/create-ingredient-dialog';

export default function IngredientsPage() {
    const { data: ingredients, isLoading } = useIngredients();
    const [createOpen, setCreateOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Ingredients</h2>
                <Button onClick={() => setCreateOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Ingredient
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ingredients?.map((ingredient) => (
                    <Card key={ingredient.id} className="bg-slate-900 border-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-200">
                                {ingredient.name}
                            </CardTitle>
                            {/* Status Badge Placeholder */}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">
                                {ingredient.stock_current} {ingredient.unit.abbreviation}
                            </div>
                            <p className="text-xs text-slate-400">
                                Min: {ingredient.stock_min} {ingredient.unit.abbreviation}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {ingredients?.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                    No ingredients found. Create your first one!
                </div>
            )}

            <CreateIngredientDialog open={createOpen} onOpenChange={setCreateOpen} />
        </div>
    );
}
