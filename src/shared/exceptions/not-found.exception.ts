// src/domain/exceptions/not-found.exception.ts

export class NotFoundException extends Error {
  constructor(entity: string, id: string) {
    super(`${entity} with id ${id} not found!`);
    this.name = 'NotFoundException';
  }
}