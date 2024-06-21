import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Admin } from '../../../../shared/interaces/admin.interface';
import { AdminService } from '../../../../shared/services/admin/admin.service.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [AdminService],
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.scss']  // Note: Updated the property name to styleUrls
})
export class ModalLoginComponent {

  adminService = inject(AdminService);
  loginForm!: FormGroup;

  @Output() done = new EventEmitter<Admin>();
  @ViewChild('sucesso') notificacaoSucesso?: ElementRef;
  @ViewChild('erro') notificacaoErro?: ElementRef;

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const loginData: Admin = {
        usuario: this.loginForm.value.username,
        senha: this.loginForm.value.password
      };

      this.adminService.validateLogin(loginData).subscribe({
        next: (response) => {
          if (response.success) {
            this.done.emit({ usuario: loginData.usuario, senha: loginData.senha });
            this.activeModal.close();
          } else {
            this.done.emit(undefined);
          }
        },
        error: (error) => {
          console.error('Error:', error);
          this.done.emit(undefined);
        }
      });
    }
  }

  closeModal() {
    this.activeModal.dismiss();
  }

}
