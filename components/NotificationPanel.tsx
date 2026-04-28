'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/lib/NotificationContext';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/lib/ThemeContext';

const typeStyles = {
  info: { bg: '#EDEBFF', bgDark: 'rgba(70,41,255,0.15)', text: '#4629FF', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  success: { bg: '#E5F5EC', bgDark: 'rgba(4,117,56,0.15)', text: '#047538', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  warning: { bg: '#FFF8DF', bgDark: 'rgba(143,93,0,0.15)', text: '#8F5D00', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  error: { bg: '#FCEBE8', bgDark: 'rgba(191,40,10,0.15)', text: '#BF280A', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
};

const font = 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)';

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
  const { theme } = useTheme();
  const t = theme === 'dark';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: { id: string; read: boolean; actionUrl?: string }) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  // Colors
  const fg1 = t ? '#fff' : '#141415';
  const fg2 = t ? '#b9bac1' : '#6C6D73';
  const fg3 = t ? '#6C6D73' : '#93949D';
  const surfPrimary = t ? '#1E1E20' : '#fff';
  const surfSecondary = t ? '#343437' : '#F4F5F6';
  const border = t ? '#343437' : '#E9EAEC';

  return (
    <div style={{ position: 'relative' }} ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: 34,
          height: 34,
          border: 0,
          background: 'transparent',
          borderRadius: 8,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t ? '#b9bac1' : '#6C6D73'} strokeWidth="1.75">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#D61F26',
            color: '#fff',
            font: `700 9px/1 ${font}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '100%',
          marginTop: 8,
          width: 320,
          background: surfPrimary,
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.16)',
          border: `1px solid ${border}`,
          overflow: 'hidden',
          zIndex: 50,
        }}>
          {/* Header */}
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: `600 14px/1 ${font}`, color: fg1 }}>Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{ border: 0, background: 'transparent', font: `500 11px/1 ${font}`, color: '#4629FF', cursor: 'pointer' }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: fg3 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 8px', opacity: 0.4 }}>
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p style={{ font: `500 13px/1 ${font}` }}>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const style = typeStyles[notification.type] || typeStyles.info;
                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: `1px solid ${border}`,
                      cursor: 'pointer',
                      background: !notification.read ? (t ? 'rgba(70,41,255,0.06)' : '#F7F5FC') : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: t ? style.bgDark : style.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={style.text} strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d={style.icon} />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ font: `600 13px/1.3 ${font}`, color: fg1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{notification.title}</span>
                          {!notification.read && (
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D61F26', flexShrink: 0 }} />
                          )}
                        </div>
                        <p style={{ font: `500 11px/1.4 ${font}`, color: fg2, marginTop: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{notification.message}</p>
                        <p style={{ font: `500 10px/1 ${font}`, color: fg3, marginTop: 4 }}>{formatTimeAgo(notification.timestamp)}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); clearNotification(notification.id); }}
                        style={{ padding: 4, border: 0, background: 'transparent', cursor: 'pointer', color: fg3 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                    {notification.actionLabel && (
                      <p style={{ font: `600 11px/1 ${font}`, color: '#4629FF', marginTop: 8 }}>{notification.actionLabel} →</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}