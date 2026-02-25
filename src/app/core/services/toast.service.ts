import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  messages = signal<ToastMessage[]>([]);

  show(type: ToastMessage['type'], message: string, duration = 3000): void {
    const id = Date.now().toString();
    const toast: ToastMessage = { id, type, message, duration };
    this.messages.update(msgs => [...msgs, toast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  warning(message: string): void {
    this.show('warning', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  remove(id: string): void {
    this.messages.update(msgs => msgs.filter(m => m.id !== id));
  }
}