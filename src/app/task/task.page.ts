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
//import { TableComponent } from 'src/app/table/table.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tasks',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
})
export class TaskPage implements OnInit {
  taskForm!: FormGroup;
  taskData: any[] = [];
  users: any[] = [];
  usersList: any[] = [];  // Lista de usuarios para el select

  // tableColumnsName: string[] = [
  //   'Usuario', 'Título', 'Descripción', 'Estado', 'Fecha de Vencimiento'
  // ];
  // tableColumns = ['user_id', 'title', 'description', 'status', 'due_date'];

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private userService: UserService
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
  }

  async fetchUsers(): Promise<void> {
    try {
      const response = await this.userService.getUsers();
      this.usersList = Array.isArray(response) ? response : [];
      console.log("Usuarios obtenidos:", this.usersList);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  }


  async onSubmit() {
    if (this.taskForm.valid) {
      console.log('Tarea creada:', this.taskForm.value);
      
      const dataForm = {
        userId: this.taskForm.value.user_id,
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        status: this.taskForm.value.status,
        dueDate: new Date(this.taskForm.value.due_date).toISOString(),
      };
      

      try {
        const respuesta = await this.taskService.sendFormData(dataForm);
        if (respuesta.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: 'Tarea creada con éxito',
            backdrop: false,
          }).then(() => {
            this.taskForm.reset();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al crear la tarea',
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
}
