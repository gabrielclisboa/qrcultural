import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { CardComponent } from "../card/card.component";
import { AdminService } from '../../../../shared/services/admin/admin.service.service';
import { CardDto } from '../../../../shared/interaces/cardDTO.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLink, CardComponent]
})
export class HomeComponent implements OnInit {
  cards = signal<CardDto[]>(inject(ActivatedRoute).snapshot.data['cards']['$values'] || []);

  isLoggedIn = false;

  constructor(public serviceAdmin: AdminService) {
  }

  ngOnInit() {
    this.isLoggedIn = this.serviceAdmin.getLogged();
    this.serviceAdmin.login.subscribe((status: boolean) => {
      this.isLoggedIn = status;
    });
  }


}
