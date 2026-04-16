'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Sample notifications
const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Price Alert',
    message: '14 SKUs are priced 8-15% above market average',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    actionUrl: '/price',
    actionLabel: 'Review Pricing',
  },
  {
    id: '2',
    type: 'info',
    title: 'New Recommendation',
    message: 'Choice Engine suggests adding Oat Milk 1L',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    actionUrl: '/assortment',
    actionLabel: 'View Recommendation',
  },
  {
    id: '3',
    type: 'success',
    title: 'SKU Added',
    message: 'Barakat Fresh Milk 2L was successfully added to assortment',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: '4',
    type: 'error',
    title: 'Stock Alert',
    message: 'Nestle Pure Life 1.5L is out of stock',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    read: false,
    actionUrl: '/sku-tower',
    actionLabel: 'View SKU',
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAll,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}