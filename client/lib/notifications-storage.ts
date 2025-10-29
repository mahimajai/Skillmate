export interface NotificationData {
  id: string;
  type: "message" | "request" | "session" | "review" | "skill" | "connect" | "comment";
  icon: string;
  title: string;
  description: string;
  time: string;
  timestamp: number;
  unread: boolean;
  actionRequired: boolean;
  fromUser?: { name: string; avatar: string };
  postId?: number;
  sessionId?: string;
}

const NOTIFICATIONS_STORAGE_KEY = "skillmate_notifications";

const getTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const defaultNotifications: NotificationData[] = [
  { id: "default-1", type: "message", icon: "MessageCircle", title: "New message from Sarah Chen", description: "Hey! I'm excited about our React session tomorrow. Should we meet at 2 PM?", time: "2 minutes ago", timestamp: Date.now() - 2 * 60 * 1000, unread: true, actionRequired: false, fromUser: { name: "Sarah Chen", avatar: "SC" } },
  { id: "default-2", type: "request", icon: "UserPlus", title: "Skill exchange request", description: "Alex Johnson wants to learn React.js in exchange for teaching Photography", time: "1 hour ago", timestamp: Date.now() - 60 * 60 * 1000, unread: true, actionRequired: true, fromUser: { name: "Alex Johnson", avatar: "AJ" } },
];

export const getAllNotifications = (): NotificationData[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(defaultNotifications));
      return defaultNotifications;
    }
    const notifications: NotificationData[] = JSON.parse(stored);
    return notifications.map((n) => ({ ...n, time: getTimeAgo(n.timestamp) }));
  } catch {
    return defaultNotifications;
  }
};

export const addNotification = (notificationData: Omit<NotificationData, "id" | "time" | "timestamp">): NotificationData => {
  const existing = getAllNotifications();
  const newN: NotificationData = { ...notificationData, id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, time: "Just now", timestamp: Date.now() };
  const updated = [newN, ...existing];
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  return newN;
};

export const markNotificationAsRead = (notificationId: string): void => {
  const list = getAllNotifications();
  const updated = list.map((n) => (n.id === notificationId ? { ...n, unread: false } : n));
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
};

export const markAllNotificationsAsRead = (): void => {
  const updated = getAllNotifications().map((n) => ({ ...n, unread: false }));
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
};

export const getUnreadNotificationsCount = (): number => {
  try { return getAllNotifications().filter((n) => n.unread).length; } catch { return 0; }
};

export const deleteNotification = (notificationId: string): void => {
  const updated = getAllNotifications().filter((n) => n.id !== notificationId);
  localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
};

export const getNotificationsByType = (type: NotificationData["type"]): NotificationData[] => {
  try { return getAllNotifications().filter((n) => n.type === type); } catch { return []; }
};

export const createMessageNotification = (fromUser: { name: string; avatar: string }, message: string) => {
  return addNotification({
    type: "message",
    icon: "MessageCircle",
    title: `New message from ${fromUser.name}`,
    description: message.length > 100 ? message.substring(0, 100) + "..." : message,
    unread: true,
    actionRequired: false,
    fromUser,
  });
};

export const createConnectNotification = (fromUser: { name: string; avatar: string }, skill?: string) => {
  return addNotification({
    type: "connect",
    icon: "UserPlus",
    title: `${fromUser.name} wants to connect`,
    description: skill ? `${fromUser.name} is interested in your ${skill} skills and wants to connect` : `${fromUser.name} wants to connect with you`,
    unread: true,
    actionRequired: true,
    fromUser,
  });
};
