'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications, Notification } from '@/lib/NotificationContext';
import { useRouter } from 'next/navigation';

const typeStyles = {
  info: { bg: 'bg-cp-color-surface-information-subtle', text: 'text-cp-color-text-information', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  success: { bg: 'bg-cp-color-surface-success-subtle', text: 'text-cp-color-text-success', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  warning: { bg: 'bg-cp-color-surface-warning-subtle', text: 'text-cp-color-text-warning', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  error: { bg: 'bg-cp-color-surface-error-subtle', text: 'text-cp-color-text-error', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const router = useRouter();

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-cp-color-text-secondary hover:text-cp-color-text-primary hover:bg-cp-color-surface-secondary rounded-lg transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cp-color-surface-error text-cp-color-text-inverse text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-cp-color-surface-primary rounded-xl shadow-xl border border-cp-color-border-primary overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-cp-color-border-primary flex items-center justify-between">
            <h3 className="font-semibold text-cp-color-text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-cp-color-text-brand hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-cp-color-text-tertiary">
                <svg className="w-12 h-12 mx-auto mb-2 text-cp-color-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const style = typeStyles[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-cp-color-border-primary hover:bg-cp-color-surface-secondary cursor-pointer transition ${
                      !notification.read ? 'bg-cp-color-surface-information-subtle/30' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full ${style.bg} flex items-center justify-center shrink-0`}>
                        <svg className={`w-4 h-4 ${style.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={style.icon} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-cp-color-text-primary truncate">{notification.title}</p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-cp-color-surface-error rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-cp-color-text-secondary mt-0.5 line-clamp-2">{notification.message}</p>
                        <p className="text-xs text-cp-color-text-tertiary mt-1">{formatTimeAgo(notification.timestamp)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                        className="p-1 text-cp-color-text-tertiary hover:text-cp-color-text-primary rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {notification.actionLabel && (
                      <p className="text-xs text-cp-color-text-brand font-medium mt-2">{notification.actionLabel} →</p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-cp-color-surface-secondary border-t border-cp-color-border-primary">
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-cp-color-text-secondary hover:text-cp-color-text-primary"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}