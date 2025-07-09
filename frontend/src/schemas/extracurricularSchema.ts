import { z } from 'zod';

export const extracurricularSchema = z.object({
  schoolName: z.string().min(1, 'Campo obrigatório'),
  activityName: z.string().min(1, 'Campo obrigatório'),
  activityDate: z.string().min(1, 'Campo obrigatório'),
  activityTime: z.string().min(1, 'Campo obrigatório'),
  embarkTime: z.string().min(1, 'Campo obrigatório'),
  returnTime: z.string().min(1, 'Campo obrigatório'),
  embarkAddress: z.string().min(1, 'Campo obrigatório'),
  embarkCep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  disembarkAddress: z.string().min(1, 'Campo obrigatório'),
  disembarkCep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
  passengers: z.string().min(1, 'Campo obrigatório'),
  vehicles: z.string().min(1, 'Campo obrigatório'),
  accessibility: z.enum(['sim', 'nao']),
  justification: z.string().min(1, 'Campo obrigatório'),
  declaration: z.boolean().refine(val => val, 'É necessário aceitar a declaração'),
});
