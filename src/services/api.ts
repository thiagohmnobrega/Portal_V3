import { z } from 'zod';
import type { RNC } from '../types/rnc';

const RNCSchema = z.object({
  id: z.string(),
  type: z.enum(['client', 'supplier']),
  status: z.enum(['new', 'analyzing', 'resolved']),
  title: z.string().min(1),
  description: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  priority: z.enum(['low', 'medium', 'high']),
  assignedTo: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  timeline: z.array(z.object({
    id: z.string(),
    type: z.enum(['creation', 'status_change', 'edit', 'contact_update', 'assignment']),
    description: z.string(),
    createdAt: z.date(),
    createdBy: z.string(),
    metadata: z.record(z.any()).optional()
  }))
});

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new APIError(response.status, await response.text());
  }
  return response.json();
};

export const api = {
  rnc: {
    list: async (): Promise<RNC[]> => {
      const response = await fetch('/api/rncs');
      const data = await handleResponse(response);
      return z.array(RNCSchema).parse(data);
    },

    get: async (id: string): Promise<RNC> => {
      const response = await fetch(`/api/rncs/${id}`);
      const data = await handleResponse(response);
      return RNCSchema.parse(data);
    },

    create: async (rnc: Omit<RNC, 'id' | 'createdAt' | 'updatedAt'>): Promise<RNC> => {
      const response = await fetch('/api/rncs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rnc),
      });
      const data = await handleResponse(response);
      return RNCSchema.parse(data);
    },

    update: async (id: string, rnc: Partial<RNC>): Promise<RNC> => {
      const response = await fetch(`/api/rncs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rnc),
      });
      const data = await handleResponse(response);
      return RNCSchema.parse(data);
    },

    delete: async (id: string): Promise<void> => {
      const response = await fetch(`/api/rncs/${id}`, {
        method: 'DELETE',
      });
      await handleResponse(response);
    }
  }
};