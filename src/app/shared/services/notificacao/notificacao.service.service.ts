import { Injectable, TemplateRef } from '@angular/core';

export interface Notificacao {
	text?:string;
	classname?: string;
	delay?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
	toasts: Notificacao[] = [];

	show(toast: Notificacao) {
		this.toasts.push(toast);
	}

	remove(toast: Notificacao) {
		this.toasts = this.toasts.filter((t) => t !== toast);
	}

	clear() {
		this.toasts.splice(0, this.toasts.length);
	}
}
