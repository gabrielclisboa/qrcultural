import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MonumentoService } from '../../../../shared/services/monumento/monumento.service';

@Component({
  selector: 'app-modal-remover',
  standalone: true,
  imports: [],
  templateUrl: './modal-remover.component.html',
  styleUrl: './modal-remover.component.scss'
})
export class ModalRemoverComponent {
  @Output() done = new EventEmitter<boolean>();
  @Input() id: number = 0;
  monumentoService = inject(MonumentoService);

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal) {
  }

  remover() {
    this.monumentoService.removeMonumento(this.id).subscribe({
      next: (response) => {
          this.done.emit(true);
          this.activeModal.close();
      },
      error: (error) => {
        console.error('Error:', error);
        this.done.emit(false);
      }
    });
  }
  closeModal() {
    this.activeModal.dismiss();
  }
}
