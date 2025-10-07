"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TreatmentNotesDialog } from "./treatment-notes-dialog";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Treatment {
  treatment: {
    id: number;
    name: string;
  } | null;
  priceAtTime: string;
  notes: string | null;
}

interface TreatmentsTableClientProps {
  treatments: Treatment[];
  appointmentId: number;
  totalCost: number;
}

export function TreatmentsTableClient({
  treatments,
  appointmentId,
  totalCost,
}: TreatmentsTableClientProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedTreatment, setSelectedTreatment] = React.useState<{
    id: number;
    name: string;
    notes: string | null;
  } | null>(null);

  const handleTreatmentClick = (treatment: Treatment) => {
    if (treatment.treatment) {
      setSelectedTreatment({
        id: treatment.treatment.id,
        name: treatment.treatment.name,
        notes: treatment.notes,
      });
      setDialogOpen(true);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Treatment</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Price at Time</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {treatments.map((t, idx) => (
              <TableRow key={idx} className="group">
                <TableCell className="font-medium">
                  {t.treatment?.name || "Unknown"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {t.notes || "No notes"}
                </TableCell>
                <TableCell className="text-right">
                  Rp {parseFloat(t.priceAtTime).toLocaleString("id-ID")}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleTreatmentClick(t)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit notes</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-bold">Total</TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right font-bold">
                Rp {totalCost.toLocaleString("id-ID")}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {selectedTreatment && (
        <TreatmentNotesDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          appointmentId={appointmentId}
          treatmentId={selectedTreatment.id}
          treatmentName={selectedTreatment.name}
          initialNotes={selectedTreatment.notes}
        />
      )}
    </>
  );
}
