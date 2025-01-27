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

  async editUser(id: number, datos: any): Promise<any> {
    try {
      // Usar la variable baseUrl para la URL completa
      const respuesta = await axios.put(
        `${this.baseUrl}/api/User/edit/${id}`,
        datos
      );
      return respuesta.data;
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<any> {
    const respuesta = await axios.delete(
      `${this.baseUrl}/api/User/delete/${id}`
    );
    return respuesta.data;
  }
}
