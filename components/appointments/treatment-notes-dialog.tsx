"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateTreatmentNotes } from "@/app/actions/appointments";

interface TreatmentNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: number;
  treatmentId: number;
  treatmentName: string;
  initialNotes?: string | null;
}

export function TreatmentNotesDialog({
  open,
  onOpenChange,
  appointmentId,
  treatmentId,
  treatmentName,
  initialNotes,
}: TreatmentNotesDialogProps) {
  const [notes, setNotes] = React.useState(initialNotes || "");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setNotes(initialNotes || "");
  }, [initialNotes]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateTreatmentNotes(
        appointmentId,
        treatmentId,
        notes
      );

      if (result.success) {
        toast.success("Treatment notes updated successfully");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Failed to update notes");
      }
    } catch (error) {
      toast.error("Failed to update notes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Treatment Notes</DialogTitle>
          <DialogDescription>
            Add or edit notes for: {treatmentName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="notes">
              Notes (dosage, frequency, intensity, etc.)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., 2 sets of 10 reps, 5kg resistance, performed with good form"
              className="min-h-[150px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Notes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
