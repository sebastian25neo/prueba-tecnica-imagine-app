import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../../services/TaskService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-apptaskcards',
  templateUrl: './apptaskcards.component.html',
  styleUrls: ['./apptaskcards.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class ApptaskcardsComponent {
  @Input() tasks: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();
  taskList: any[] = [];

  constructor(private router: Router, private taskService: TaskService) {}

  currentPage: number = 1;
  itemsPerPage: number = 2;
  totalPages!: number;

  get paginatedTasks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.tasks.slice(startIndex, endIndex);
  }

  ngOnChanges() {
    this.totalPages = Math.ceil(this.tasks.length / this.itemsPerPage);
  }

  editTask(task: any) {
    this.router.navigate(['/task', task.id]);
    this.edit.emit(task);
  }

  async deleteTask(id: number) {
    // Mostrar modal de confirmación antes de eliminar
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar esta tarea?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      backdrop: false, // Desactiva el fondo oscuro
    });

    if (confirm.isConfirmed) {
      try {
        // Llamada al servicio para eliminar la tarea
        const respuesta = await this.taskService.deleteTask(id); // Cambiar a deleteTask

        if (respuesta.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Tarea eliminada con éxito',
            backdrop: false, // Desactiva el fondo oscuro
          }).then(() => {
            // Eliminar la tarea de la lista
            this.tasks = this.tasks.filter((row) => row.id !== id); // Cambiar "data" por "taskData"
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al eliminar la tarea',
            backdrop: false, // Desactiva el fondo oscuro
          });
        }
      } catch (error: any) {
        console.error('Error al eliminar la tarea:', error);

        // Verificación de la estructura del error
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
            backdrop: false, // Desactiva el fondo oscuro
          });
        } else {
          // Manejo de errores desconocidos o sin la estructura esperada
          Swal.fire({
            icon: 'error',
            title: 'Error desconocido',
            text: 'Hubo un problema al procesar la solicitud. Intente de nuevo más tarde.',
            backdrop: false, // Desactiva el fondo oscuro
          });
        }
      }
    } else {
      console.log('Acción cancelada por el usuario');
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getStatusClass(status: string) {
    switch (status.toLowerCase()) {
      case 'completado':
        return 'completed';
      case 'pendiente':
        return 'pending';
      case 'en progreso':
        return 'inProgress';
      case 'atrasada':
        return 'overdue';
      default:
        return '';
    }
  }
}
