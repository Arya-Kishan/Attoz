import { Bell, Check, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'video';
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    avatar?: string;
    thumbnail?: string;
}

const Notification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            type: 'like',
            title: 'Sarah Johnson liked your video',
            message: 'Your video "React Best Practices" received a new like',
            time: '2 minutes ago',
            isRead: false,
            avatar: 'https://via.placeholder.com/50',
            thumbnail: 'https://via.placeholder.com/80x45'
        },
        {
            id: '2',
            type: 'comment',
            title: 'Mike Chen commented on your video',
            message: '"Great tutorial! This helped me a lot. Thanks for sharing!"',
            time: '15 minutes ago',
            isRead: false,
            avatar: 'https://via.placeholder.com/50',
            thumbnail: 'https://via.placeholder.com/80x45'
        },
        {
            id: '3',
            type: 'follow',
            title: 'Emma Rodriguez started following you',
            message: 'You have a new follower',
            time: '1 hour ago',
            isRead: false,
            avatar: 'https://via.placeholder.com/50'
        },
        {
            id: '4',
            type: 'video',
            title: 'Your video is processing',
            message: 'Your video "Behind the Scenes" is being processed and will be live soon',
            time: '2 hours ago',
            isRead: true,
            thumbnail: 'https://via.placeholder.com/80x45'
        },
        {
            id: '5',
            type: 'like',
            title: 'David Park liked your video',
            message: 'Your video "City Vlog" received a new like',
            time: '3 hours ago',
            isRead: true,
            avatar: 'https://via.placeholder.com/50',
            thumbnail: 'https://via.placeholder.com/80x45'
        },
        {
            id: '6',
            type: 'comment',
            title: 'Lisa Anderson commented',
            message: '"Amazing content! Keep it up! 🔥"',
            time: '5 hours ago',
            isRead: true,
            avatar: 'https://via.placeholder.com/50',
            thumbnail: 'https://via.placeholder.com/80x45'
        },
        {
            id: '7',
            type: 'follow',
            title: 'James Wilson started following you',
            message: 'You have a new follower',
            time: '1 day ago',
            isRead: true,
            avatar: 'https://via.placeholder.com/50'
        }
    ]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-xl p-6 mb-6 border-2 border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Bell className="text-purple-600" size={32} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                                <p className="text-gray-600">
                                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                                </p>
                            </div>
                        </div>

                        {notifications.length > 0 && (
                            <div className="flex gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-semibold hover:bg-blue-200 transition-all flex items-center gap-2"
                                    >
                                        <Check size={18} />
                                        <span className="hidden sm:inline">Mark all read</span>
                                    </button>
                                )}
                                <button
                                    onClick={clearAll}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-semibold hover:bg-red-200 transition-all flex items-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    <span className="hidden sm:inline">Clear all</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-3xl shadow-xl p-16 text-center border-2 border-gray-100">
                    <Bell className="mx-auto mb-4 text-gray-300" size={64} />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">COMING SOON - IN PROGESS</h3>
                    <p className="text-gray-600">You're all caught up! Check back later for updates.</p>
                </div>

            </div>
        </div>
    );
};

export default Notification;