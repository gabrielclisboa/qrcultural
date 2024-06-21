import { Component, input, Output, EventEmitter, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardDto } from '../../../../shared/interaces/cardDTO.interface';
import { Router, RouterLink } from '@angular/router';
import { ModalRemoverComponent } from '../modal-remover/modal-remover.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificacaoService } from '../../../../shared/services/notificacao/notificacao.service.service';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ModalRemoverComponent, CommonModule, RouterLink],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Output() edit = new EventEmitter();
  @Output() delete = new EventEmitter();

  notificacaoService = inject(NotificacaoService);
  router = inject(Router);

  card = input.required<CardDto>();
  isAdminMode = input.required<boolean>();
  cardData = computed(() => this.card());
  enableEditDelete = computed(() => this.isAdminMode());

  constructor(private modalService: NgbModal) {
  }

  onEdit(event: MouseEvent, monumentoId: number) {
    event.stopPropagation();
    this.router.navigate([`editar-monumento/${monumentoId}`]);
  }


  onDelete(event: MouseEvent, monumentoId: number) {
    event.stopPropagation();
    const modalRef = this.modalService.open(ModalRemoverComponent, { centered: true });
    modalRef.componentInstance.id = monumentoId;
    modalRef.componentInstance.done.subscribe((sucess: boolean) => {
      this.notificacaoService.show({ text: "Exclusão ocorreu com sucesso!", classname: 'bg-success text-light', delay: 2000 });
      location.reload();
    });
  }
}
