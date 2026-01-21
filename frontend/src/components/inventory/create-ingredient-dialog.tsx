import { useState } from "react";
import { Dialog } from "@/components/ui/dialog-simple";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select-native";
import { useCreateIngredient, useUnits, useProductFamilies } from "@/hooks/use-inventory";
import { CreateFamilyDialog } from "./create-family-dialog";
import { PlusCircle } from "lucide-react";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateIngredientDialog({ open, onOpenChange }: Props) {
    const { data: units } = useUnits();
    const { data: families } = useProductFamilies();
    const { mutate: create, isPending } = useCreateIngredient();

    // Nested Dialog State
    const [familyOpen, setFamilyOpen] = useState(false);

    const [form, setForm] = useState({
        name: '',
        unitId: '',
        familyId: '',
        stockCurrent: 0,
        stockMin: 0,
        costPrice: 0
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        create({
            ...form,
            unitId: form.unitId,
            familyId: form.familyId || undefined, // Send undefined if empty string
        }, {
            onSuccess: () => {
                onOpenChange(false);
                setForm({ name: '', unitId: '', familyId: '', stockCurrent: 0, stockMin: 0, costPrice: 0 });
            }
        });
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange} title="New Ingredient" description="Add a new item to your inventory.">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                            placeholder="e.g. Carrots"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Unit</Label>
                            <Select
                                value={form.unitId}
                                onChange={e => setForm({ ...form, unitId: e.target.value })}
                                required
                            >
                                <option value="" disabled>Select Unit</option>
                                {units?.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.abbreviation})</option>
                                ))}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex justify-between">
                                Family
                                <span className="text-emerald-500 cursor-pointer text-xs flex items-center" onClick={() => setFamilyOpen(true)}>
                                    <PlusCircle className="w-3 h-3 mr-1" /> New
                                </span>
                            </Label>
                            <Select
                                value={form.familyId}
                                onChange={e => setForm({ ...form, familyId: e.target.value })}
                            >
                                <option value="">No Family</option>
                                {families?.map(f => (
                                    <option key={f.id} value={f.id}>{f.name}</option>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Current Stock</Label>
                            <Input type="number" step="0.001" value={form.stockCurrent} onChange={e => setForm({ ...form, stockCurrent: Number(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Min Stock</Label>
                            <Input type="number" step="0.001" value={form.stockMin} onChange={e => setForm({ ...form, stockMin: Number(e.target.value) })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Cost ($)</Label>
                            <Input type="number" step="0.01" value={form.costPrice} onChange={e => setForm({ ...form, costPrice: Number(e.target.value) })} />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save Ingredient'}</Button>
                    </div>
                </form>
            </Dialog>

            <CreateFamilyDialog open={familyOpen} onOpenChange={setFamilyOpen} />
        </>
    )
}
