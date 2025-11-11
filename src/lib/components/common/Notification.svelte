<script lang="ts">
	import { notificationStore, type NotificationLevel, settingsStore } from '$lib/stores';
	import { onMount } from 'svelte';

	/**
	 * 通知レベルに応じたスタイルクラスを取得
	 */
	function getLevelClass(level: NotificationLevel): string {
		return `notification-${level}`;
	}

	/**
	 * 通知レベルに応じたアイコンを取得
	 */
	function getLevelIcon(level: NotificationLevel): string {
		switch (level) {
			case 'info':
				return 'ℹ️';
			case 'warning':
				return '⚠️';
			case 'error':
				return '❌';
			case 'critical':
				return '🚨';
		}
	}

	/**
	 * 通知を閉じる
	 */
	function closeNotification(id: string) {
		notificationStore.remove(id);
	}

	/**
	 * グローバルキーボードイベント（Escキーで全ての通知をクリア）
	 * Settingsパネルが開いていない場合のみ動作
	 */
	function handleGlobalKeyDown(event: KeyboardEvent) {
		if (
			event.key === 'Escape' &&
			notificationStore.notifications.length > 0 &&
			!settingsStore.isSettingsOpen
		) {
			event.preventDefault();
			notificationStore.clear();
		}
	}

	/**
	 * グローバルキーボードリスナーを登録
	 */
	onMount(() => {
		window.addEventListener('keydown', handleGlobalKeyDown);
		return () => {
			window.removeEventListener('keydown', handleGlobalKeyDown);
		};
	});
</script>

<div class="notification-container" class:dark={settingsStore.isDarkMode}>
	{#each notificationStore.notifications as notification (notification.id)}
		<div
			class="notification {getLevelClass(notification.level)}"
			role="alert"
			aria-live={notification.level === 'critical' || notification.level === 'error'
				? 'assertive'
				: 'polite'}
		>
			<div class="notification-content">
				<span class="notification-icon">{getLevelIcon(notification.level)}</span>
				<span class="notification-message">{notification.message}</span>
			</div>
			<button
				class="notification-close"
				on:click={() => closeNotification(notification.id)}
				aria-label="Close notification"
			>
				<span class="close-icon">✕</span>
			</button>
		</div>
	{/each}
</div>

<style>
	.notification-container {
		position: fixed;
		bottom: 40px;
		right: 20px;
		z-index: var(--z-notification);
		display: flex;
		flex-direction: column;
		gap: 12px;
		max-width: 400px;
		pointer-events: none;
	}

	.notification {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 16px;
		border-radius: 8px;
		box-shadow: var(--shadow-lg);
		background-color: var(--bg-secondary);
		color: var(--text-primary);
		pointer-events: auto;
		animation: slideIn var(--transition-normal);
		transition:
			background-color var(--transition-normal),
			color var(--transition-normal),
			box-shadow var(--transition-normal);
		border-left: 4px solid transparent;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	@keyframes slideIn {
		from {
			transform: translateX(120%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	/* レベル別のスタイル */
	.notification-info {
		border-left-color: var(--notification-info-border);
	}

	.notification-warning {
		border-left-color: var(--notification-warning-border);
	}

	.notification-error {
		border-left-color: var(--notification-error-border);
	}

	.notification-critical {
		border-left-color: var(--notification-critical-border);
		background-color: var(--notification-critical-bg);
	}

	.notification-content {
		display: flex;
		align-items: center;
		gap: 12px;
		flex: 1;
		min-width: 0;
	}

	.notification-icon {
		font-size: 1.2rem;
		flex-shrink: 0;
		line-height: 1;
		display: block;
	}

	.notification-message {
		flex: 1;
		word-break: break-word;
	}

	.notification-close {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0;
		margin-left: 12px;
		width: 1.5rem;
		height: 1.5rem;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color var(--transition-fast);
	}

	.notification-close .close-icon {
		font-size: 1.2rem;
		line-height: 1;
		display: block;
	}

	.notification-close:hover {
		color: var(--text-primary);
	}

	.notification-close:focus {
		outline: none;
	}

	.notification-close:focus-visible {
		outline: 2px solid #4caf50;
		outline-offset: 0;
		border-radius: 4px;
	}

	/* レスポンシブ対応 */
	@media (max-width: 480px) {
		.notification-container {
			right: 12px;
			left: 12px;
			max-width: none;
		}

		.notification {
			font-size: 0.85rem;
		}
	}
</style>
