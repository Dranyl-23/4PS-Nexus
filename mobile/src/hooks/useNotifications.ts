import { useState, useEffect, useCallback } from 'react';
import { BeneficiaryService } from '../services/api';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function useNotifications(wallet: string | null) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!wallet) return;
    try {
      const data = await BeneficiaryService.getNotifications(wallet);
      setNotifications(data);
      const unread = data.filter((n: AppNotification) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.warn('Failed to fetch notifications silently', err);
    }
  }, [wallet]);

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Poll every 5 seconds for "real-time" feel
    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async () => {
    if (!wallet || unreadCount === 0) return;
    
    // Optimistic UI update
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

    await BeneficiaryService.markNotificationsRead(wallet);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    refresh: fetchNotifications
  };
}
