import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TaskService } from '../../services/TaskService';
import { UserService } from '../../services/UserService';
import { ApptaskcardsComponent } from 'src/app/componen/apptaskcards/apptaskcards.component';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    ApptaskcardsComponent,
  ],
})
export class TaskPage implements OnInit {
  taskForm!: FormGroup;
  taskData: any[] = [];
  users: any[] = [];
  usersList: any[] = [];
  isEditing = false;

  taskId: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.taskForm = this.formBuilder.group({
      user_id: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      status: ['', Validators.required],
      due_date: ['', Validators.required],
    });

    //await this.fetchTasks();
    await this.fetchUsers();

    // Verificar si estamos en el modo de edición
     this.taskId = this.route.snapshot.paramMap.get('taskId');
    if (this.taskId) {
      console.log('Modo edición:', this.taskId);
      this.isEditing = true;
      await this.fetchTask(this.taskId);
    }
  }

  async fetchTask(id: string): Promise<void> {
    try {
      const numericId = Number(id); // Convertir id a número
      if (isNaN(numericId)) {
        throw new Error('El ID de la tarea no es un número válido.');
      }

      const response = await this.taskService.getTaskById(numericId);

      if (response?.status === 'success' && response.data) {
        const task = response.data;

        this.taskForm.patchValue({
          user_id: task.userId || '', // Ajusta según la estructura real de la tarea
          title: task.title || '',
          description: task.description || '',
          status: task.status || '',
          due_date: task.dueDate ? task.dueDate.split('T')[0] : '', // Extrae solo la parte de la fecha
        });
      } else {
        throw new Error(
          response?.message || 'No se encontraron datos de la tarea.'
        );
      }
    } catch (error) {
      console.error('Error al obtener la tarea:', error);
    }
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

  async onSubmit() {
    if (this.taskForm.valid) {
      console.log(this.isEditing ? 'Editando tarea:' : 'Creando tarea:', this.taskForm.value);
  
      const dataForm = {
        userId: this.taskForm.value.user_id,
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        status: this.taskForm.value.status,
        dueDate: new Date(this.taskForm.value.due_date).toISOString(),
      };
  
      try {
        const numericId = Number(this.taskId);
        const respuesta = this.isEditing
          ? await this.taskService.editTask( numericId, dataForm)
          : await this.taskService.sendFormData(dataForm);
  
        if (respuesta.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: this.isEditing ? 'Tarea actualizada con éxito' : 'Tarea creada con éxito',
            backdrop: false,
          }).then(() => {
            this.taskForm.reset();
            this.router.navigateByUrl('/view-task'); // Redirigir después de la operación
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.isEditing ? 'Hubo un error al actualizar la tarea' : 'Hubo un error al crear la tarea',
            backdrop: false,
          });
        }
      } catch (error: any) {
        console.error('Error al enviar los datos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error desconocido',
          text: 'Hubo un problema al procesar la solicitud.',
          backdrop: false,
        });
      }
    } else {
      console.log('Formulario inválido');
      Object.keys(this.taskForm.controls).forEach((key) => {
        const control = this.taskForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  isFieldInvalid(field: string) {
    const control = this.taskForm.get(field);
    return control && control.invalid && control.touched;
  }

  viewTask() {
    this.router.navigateByUrl('/view-task');
    // Lógica para visualizar la tarea (navegación a otra vista, modal, etc.)
  }
}
