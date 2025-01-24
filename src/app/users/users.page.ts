import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class UsersPage {
  user = {
    name: '',
    email: ''
  };

  onSubmit() {
    // Handle user creation logic here
    console.log('Usuario creado:', this.user);
  }
}