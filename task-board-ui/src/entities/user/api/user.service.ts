import { Injectable, inject, signal } from '@angular/core';
import { BaseApiService } from '@shared/api/base-api.service';
import { User } from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseApiService {
  private readonly _users = signal<User[]>([]);
  readonly users = this._users.asReadonly();

  async getAll(): Promise<User[]> {
    if (this._users().length === 0) {
      await this.loadUsers();
    }
    return this._users();
  }

  getById(id: string): User | undefined {
    return this._users().find(u => u.id === id);
  }

  getUsersByIds(ids: string[] | null | undefined): User[] {
    if (!ids || ids.length === 0) {
      return [];
    }
    return this._users().filter(u => ids.includes(u.id));
  }
  
  async loadUsers(): Promise<void> {
    this.httpGet<User[]>('/users').subscribe({
      next: (users) => this._users.set(users),
      error: (err) => console.error('Failed to load users', err)
    });
  }
}
