import { useState } from "react";
import { Dialog } from "@/components/ui/dialog-simple";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateFamily } from "@/hooks/use-inventory";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateFamilyDialog({ open, onOpenChange }: Props) {
    const [name, setName] = useState("");
    const [buffer, setBuffer] = useState("1.10");
    const { mutate: createFamily, isPending } = useCreateFamily();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createFamily({
            name,
            safetyBufferPct: parseFloat(buffer)
        }, {
            onSuccess: () => {
                onOpenChange(false);
                setName("");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange} title="Create Product Family" description="Group ingredients to apply safety buffers.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label>Family Name</Label>
                    <Input placeholder="e.g. Vegetables, Dairy" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label>Safety Buffer (%)</Label>
                    <Input type="number" step="0.01" min="1.0" max="2.0" value={buffer} onChange={e => setBuffer(e.target.value)} required />
                    <p className="text-xs text-slate-500">1.10 = 10% Extra</p>
                </div>
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isPending}>{isPending ? 'Creating...' : 'Create Family'}</Button>
                </div>
            </form>
        </Dialog>
    )
}
