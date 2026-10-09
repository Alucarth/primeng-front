import { Injectable } from '@angular/core';

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class FileValidationService {
  validateFileSize(file: File, maxSize: number = MAX_FILE_SIZE): FileValidationResult {
    if (file.size > maxSize) {
      const maxMB = maxSize / (1024 * 1024);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `El archivo "${file.name}" pesa ${fileSizeMB} MB. El tamaño máximo permitido es ${maxMB} MB.`,
      };
    }
    return { valid: true };
  }
}
