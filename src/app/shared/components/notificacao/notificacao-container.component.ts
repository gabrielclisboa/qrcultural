import { NotificacaoService } from './../../services/notificacao/notificacao.service.service';
import { Component, inject } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-toasts',
	standalone: true,
	imports: [NgbToastModule, NgTemplateOutlet],
	template: `
		@for (toast of notificacaoService.toasts; track toast) {
			<ngb-toast
				[class]="toast.classname"
				[autohide]="true"
				[delay]="toast.delay || 5000"
				(hidden)="notificacaoService.remove(toast)"
			>
				<p>{{toast.text}}</p>
			</ngb-toast>
		}
	`,
	host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
})
export class NotificacaoContainer {
	notificacaoService = inject(NotificacaoService);
}
