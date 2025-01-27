import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public appPages = [
    { title: 'Crear Usuarios', url: '/users', icon: 'mail' },
    { title: 'Crear Tareas', url: '/task', icon: 'mail' },
  ];
  constructor() {}
}
