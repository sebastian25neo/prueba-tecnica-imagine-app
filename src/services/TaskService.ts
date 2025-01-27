import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // Variable global para la URL base de la API
  private baseUrl: string = 'http://localhost:8080';

  constructor() {}

  async sendFormData(datos: any): Promise<any> {
    try {
      // Usar la variable baseUrl para la URL completa
      const respuesta = await axios.post(
        `${this.baseUrl}/api/Task/create`,
        datos
      );
      return respuesta.data;
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      throw error;
    }
  }
  
  async getTaskById(id: number ): Promise<any> {
    try {
      // Usar la variable baseUrl para la URL completa
      const respuesta = await axios.get(
        `${this.baseUrl}/api/Task/${id}`
      );
      return respuesta.data;
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      throw error;
    }
  }

  async taskSearch(id: number, status: string): Promise<any> {
    try {
      // Usar la variable baseUrl para la URL completa
      const respuesta = await axios.get(
        `${this.baseUrl}/api/Task/search?userId=${id}&status=${status}`
      );
      return respuesta.data;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error;
    }
  }

  async editTask(id: number, datos: any): Promise<any> {
    try {
      // Usar la variable baseUrl para la URL completa
      const respuesta = await axios.put(
        `${this.baseUrl}/api/Task/edit/${id}`,
        datos
      );
      return respuesta.data;
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      throw error;
    }
  }

  async deleteTask(id: number): Promise<any> {
    const respuesta = await axios.delete(
      `${this.baseUrl}/api/Task/delete/${id}`
    );
    return respuesta.data;
  }
}
