"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

type Notification = {
  id: string;
  message: string;
  timestamp: Date;
  type: "error" | "warning" | "info";
};

let notificationListeners: ((notification: Notification) => void)[] = [];

export function addNotification(message: string, type: "error" | "warning" | "info" = "info") {
  const notification: Notification = {
    id: Math.random().toString(36).substring(7),
    message,
    timestamp: new Date(),
    type,
  };
  notificationListeners.forEach((listener) => listener(notification));
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const listener = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 10)); // Keep last 10
    };
    notificationListeners.push(listener);

    return () => {
      notificationListeners = notificationListeners.filter((l) => l !== listener);
    };
  }, []);

  const unreadCount = notifications.length;

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-xs text-white flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No notifications
            </p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-md text-sm border ${
                    notification.type === "error"
                      ? "border-destructive/50 bg-destructive/10"
                      : notification.type === "warning"
                      ? "border-yellow-500/50 bg-yellow-500/10"
                      : "border-border bg-muted"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className="flex-1">{notification.message}</p>
                    <button
                      onClick={() => clearNotification(notification.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
