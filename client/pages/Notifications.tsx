import { Bell, Check, X, MessageCircle, Calendar, Star, UserPlus, BookOpen, Settings, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { getAllNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, getNotificationsByType, type NotificationData } from "@/lib/notifications-storage";
import { useToast } from "@/hooks/use-toast";

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = { MessageCircle, UserPlus, Calendar, Star, BookOpen, Check };
  return iconMap[iconName] || MessageCircle;
};

const getNotificationColor = (type: string) => type === 'message' ? 'text-blue-500' : type === 'request' ? 'text-green-500' : type === 'session' ? 'text-purple-500' : type === 'review' ? 'text-yellow-500' : type === 'skill' ? 'text-cyan-500' : 'text-gray-500';

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationData[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => { load(); }, []);
  useEffect(() => { setFilteredNotifications(activeFilter === 'all' ? notifications : getNotificationsByType(activeFilter as any)); }, [notifications, activeFilter]);

  const load = () => setNotifications(getAllNotifications());
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAsRead = (id: string) => { markNotificationAsRead(id); load(); window.dispatchEvent(new Event("notificationUpdated")); };
  const handleMarkAllAsRead = () => { markAllNotificationsAsRead(); load(); window.dispatchEvent(new Event("notificationUpdated")); toast({ title: "All notifications marked as read" }); };
  const handleDelete = (id: string) => { deleteNotification(id); load(); window.dispatchEvent(new Event("notificationUpdated")); toast({ title: "Notification deleted" }); };

  const filterButtons = [ { key: 'all', label: 'All' }, { key: 'message', label: 'Messages' }, { key: 'request', label: 'Requests' }, { key: 'connect', label: 'Connects' }, { key: 'session', label: 'Sessions' }, { key: 'review', label: 'Reviews' }, { key: 'comment', label: 'Comments' } ];

  return (
    <div className="min-h-screen bg-background pt-8">
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3"><Bell className="w-8 h-8" />Notifications {unreadCount > 0 && (<Badge className="bg-red-500 text-white">{unreadCount} new</Badge>)}</h1>
              <p className="text-muted-foreground">Stay updated with your skill exchanges</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}><Check className="w-4 h-4 mr-2" />Mark All Read</Button>
              <Button variant="outline"><Settings className="w-4 h-4 mr-2" />Settings</Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {filterButtons.map((f) => (
              <Button key={f.key} variant={activeFilter === f.key ? 'default' : 'outline'} size="sm" onClick={() => setActiveFilter(f.key)}>{f.label}</Button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-16"><div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><Bell className="w-8 h-8 text-muted-foreground" /></div><h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3><p className="text-muted-foreground">Start interacting to see updates here.</p></div>
            ) : (
              filteredNotifications.map((n) => {
                const Icon = getIconComponent(n.icon);
                return (
                  <div key={n.id} className={`p-6 rounded-2xl border transition-all duration-200 hover:shadow-md ${n.unread ? 'bg-card border-primary/20 shadow-sm' : 'bg-card/50 border-border/20'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center`}><Icon className={`w-6 h-6 ${getNotificationColor(n.type)}`} /></div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div className={n.unread ? "cursor-pointer" : ""} onClick={() => n.unread && handleMarkAsRead(n.id)}>
                            <h3 className="font-semibold text-foreground">{n.title}{n.unread && (<span className="inline-block w-2 h-2 bg-primary rounded-full ml-2"></span>)}</h3>
                            <p className="text-muted-foreground leading-relaxed">{n.description}</p>
                            <p className="text-sm text-muted-foreground">{n.time}{n.fromUser && (<span className="ml-2 text-primary font-medium">from {n.fromUser.name}</span>)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(n.id)}><MoreHorizontal className="w-4 h-4" /></Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
