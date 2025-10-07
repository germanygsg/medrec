"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Trash2, Moon, Sun, Laptop } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { wipeAllData } from "@/app/actions/settings";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleWipeData = async () => {
    if (confirmText !== "DELETE ALL DATA") {
      toast.error("Please type the confirmation text correctly");
      return;
    }

    setIsDeleting(true);
    try {
      const result = await wipeAllData();
      if (result.success) {
        toast.success("All data has been wiped successfully");
        setDialogOpen(false);
        setConfirmText("");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to wipe data");
      }
    } catch {
      toast.error("An error occurred while wiping data");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid gap-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how the application looks on your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Theme</Label>
                {!mounted ? (
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" disabled>
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </Button>
                    <Button variant="outline" className="flex-1" disabled>
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </Button>
                    <Button variant="outline" className="flex-1" disabled>
                      <Laptop className="mr-2 h-4 w-4" />
                      System
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setTheme("system")}
                    >
                      <Laptop className="mr-2 h-4 w-4" />
                      System
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that affect all your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">Wipe All Data</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete all patients, treatments, appointments, and
                  invoices. This action cannot be undone.
                </p>
              </div>
              <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="ml-4">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Wipe All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-destructive">
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                      <div>
                        <p>This action cannot be undone. This will permanently delete:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>All patient records</li>
                          <li>All treatments</li>
                          <li>All appointments</li>
                          <li>All invoices</li>
                        </ul>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="my-4">
                    <Label htmlFor="confirm" className="text-sm font-medium">
                      Type{" "}
                      <span className="font-mono font-bold">
                        DELETE ALL DATA
                      </span>{" "}
                      to confirm
                    </Label>
                    <Input
                      id="confirm"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="DELETE ALL DATA"
                      className="mt-2"
                      disabled={isDeleting}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      disabled={isDeleting}
                      onClick={() => setConfirmText("")}
                    >
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault();
                        handleWipeData();
                      }}
                      disabled={isDeleting || confirmText !== "DELETE ALL DATA"}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {isDeleting ? "Deleting..." : "Delete All Data"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
