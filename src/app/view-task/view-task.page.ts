import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/UserService';
import { ApptaskcardsComponent } from 'src/app/componen/apptaskcards/apptaskcards.component';
import Swal from 'sweetalert2';
import { TaskService } from '../../services/TaskService';
@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.page.html',
  styleUrls: ['./view-task.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    ApptaskcardsComponent,
  ],
})
export class ViewTaskPage implements OnInit {
  filterForm!: FormGroup;
  usersList: any[] = [];
  task: any[] = [];
  taskList: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private taskService: TaskService,
  ) {}

  async ngOnInit() {
    this.filterForm = this.formBuilder.group({
      user_id: [''],
      status: [''],
    });

    await this.fetchUsers();
  }

  async fetchUsers(): Promise<void> {
    try {
      const response = await this.userService.getUsers();
      this.usersList = Array.isArray(response) ? response : [];
      console.log('Usuarios obtenidos:', this.usersList);
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }
  }

  async onSearch() {
    const filters = this.filterForm.value;
    console.log('Filtros seleccionados:', filters);
  
    try {
      const response = await this.taskService.taskSearch(filters.user_id, filters.status);
  
      if (response && response.status === 'success' && Array.isArray(response.data)) {
        this.taskList = response.data;
        console.log('Tareas obtenidas:', this.taskList);
      } else {
        console.error('Respuesta inesperada del backend:', response);
        Swal.fire({
          icon: 'warning',
          title: 'Advertencia',
          text: 'No se encontraron tareas con los filtros seleccionados.',
          backdrop: false, // Desactiva el fondo oscuro
        });
      }
    } catch (error: any) {
      console.error('Error al enviar los datos:', error);
  
      if (
        error &&
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response.data.message,
          backdrop: false,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error desconocido',
          text: 'Hubo un problema al procesar la solicitud. Intente de nuevo más tarde.',
          backdrop: false,
        });
      }
    }
  }
  

  // taskList = [
  //   {
  //     id: 1,
  //     userId: 2,
  //     title: 'Leer un libro',
  //     description: 'Terminar capítulo 1',
  //     status: 'pendiente',
  //     dueDate: '2024-02-01T00:00:00',
  //   },
  //   {
  //     id: 2,
  //     userId: 2,
  //     title: 'Ver una película',
  //     description: 'Mirar película de acción',
  //     status: 'completada',
  //     dueDate: '2024-02-02T00:00:00',
  //   },
  //   {
  //     id: 3,
  //     userId: 2,
  //     title: 'Hacer ejercicio',
  //     description: 'Ir al gimnasio',
  //     status: 'pendiente',
  //     dueDate: '2024-02-03T00:00:00',
  //   },
  //   // Agrega más tareas si es necesario
  // ];

  onEdit(task: any) {
    console.log('Editar tarea:', task);
    // Lógica para editar la tarea (abrir modal, cambiar estado, etc.)
  }

  onDelete(id: number) {
    console.log('Eliminar tarea con ID:', id);
    this.taskList = this.taskList.filter((task) => task.id !== id);
  }
}
