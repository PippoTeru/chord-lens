/**
 * 通知ストア - エラーや情報メッセージの表示管理
 */

export type NotificationLevel = 'info' | 'warning' | 'error' | 'critical';

export interface Notification {
	id: string;
	level: NotificationLevel;
	message: string;
	timestamp: number;
	duration?: number; // 表示時間（ミリ秒）。undefinedの場合は自動的に消えない
}

class NotificationStore {
	notifications = $state<Notification[]>([]);

	/**
	 * 通知を追加
	 */
	add(level: NotificationLevel, message: string, duration?: number): string {
		const id = `notification-${Date.now()}-${Math.random()}`;
		const notification: Notification = {
			id,
			level,
			message,
			timestamp: Date.now(),
			duration
		};

		this.notifications = [...this.notifications, notification];

		// 自動削除（durationが指定されている場合）
		if (duration !== undefined) {
			setTimeout(() => {
				this.remove(id);
			}, duration);
		}

		return id;
	}

	/**
	 * 通知を削除
	 */
	remove(id: string) {
		this.notifications = this.notifications.filter((n) => n.id !== id);
	}

	/**
	 * すべての通知をクリア
	 */
	clear() {
		this.notifications = [];
	}

	/**
	 * 情報通知（自動的に3秒で消える）
	 */
	info(message: string, duration: number = 3000): string {
		return this.add('info', message, duration);
	}

	/**
	 * 警告通知（自動的に5秒で消える）
	 */
	warning(message: string, duration: number = 5000): string {
		return this.add('warning', message, duration);
	}

	/**
	 * エラー通知（自動的に7秒で消える）
	 */
	error(message: string, duration: number = 7000): string {
		return this.add('error', message, duration);
	}

	/**
	 * 致命的エラー通知（手動で閉じるまで表示）
	 */
	critical(message: string): string {
		return this.add('critical', message);
	}
}

export const notificationStore = new NotificationStore();
