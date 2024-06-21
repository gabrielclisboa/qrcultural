import { AdminService } from './../../services/admin/admin.service.service';
import { Component, inject } from '@angular/core';
import { ModalLoginComponent } from "../../../features/home/components/modal-login/modal-login.component";
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificacaoService } from '../../services/notificacao/notificacao.service.service';
import { NotificacaoContainer } from '../notificacao/notificacao-container.component';
import { RouterLink } from '@angular/router';
import { Admin } from '../../interaces/admin.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [ModalLoginComponent, CommonModule, NotificacaoContainer, RouterLink]
})
export class HeaderComponent {

  isLoggedIn = false;
  notificacaoService = inject(NotificacaoService);

  constructor(private modalService: NgbModal, private adminService: AdminService) { }

  ngOnInit() {
    this.isLoggedIn = this.adminService.getLogged();
    this.adminService.login.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }

  openModal() {
    const modalRef = this.modalService.open(ModalLoginComponent, { centered: true });
    modalRef.componentInstance.done.subscribe((user: Admin) => {
      if (user !== undefined) {
        this.isLoggedIn = true;
        this.notificacaoService.show({ text: "Login realizado com Sucesso!", classname: 'bg-success text-light', delay: 2000 });
        this.adminService.setLogged(user.usuario, user.senha);
      } else {
        this.isLoggedIn = false;
        this.notificacaoService.show({ text: "Login incorreto! Tente novamente.", classname: 'bg-danger text-light', delay: 2000 });
      }
    })
  }

  logout(){
    this.adminService.logout();
  }
}
