import { Software } from '../entities/Software';
import { v4 as uuidv4 } from 'uuid';

class SoftwareRepository {
  private items: Software[] = [];

  async findAll() {
    return this.items;
  }
  
  async findById(id: string) {
    return this.items.find(i => i.id === id);
  }

  async create(data: Omit<Software, 'id'>) {
    const newItem = { id: uuidv4(), ...data };
    this.items.push(newItem);
    return newItem;
  }

  async update(id: string, data: Partial<Software>) {
    const index = this.items.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.items[index] = { ...this.items[index], ...data };
    return this.items[index];
  }

  async delete(id: string) {
    const initialLength = this.items.length;
    this.items = this.items.filter(i => i.id !== id);
    return this.items.length !== initialLength;
  }
}

export const softwareRepo = new SoftwareRepository();