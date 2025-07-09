import * as z from 'zod';

export const routeSchema = z.object({
  id: z.string().min(1, 'O ID da rota é obrigatório.'),
  routeName: z.string().min(1, 'O nome da rota é obrigatório.'),
  shift: z.enum(['Matutino', 'Vespertino', 'Integral'], {
    required_error: 'O turno é obrigatório.',
  }),
  companyId: z.string().min(1, 'A empresa responsável é obrigatória.'),
  vehicleId: z.string().min(1, 'O veículo alocado é obrigatório.'),
  students: z.number().min(0, 'O número de alunos deve ser maior ou igual a 0.'),
  capacity: z.number().min(1, 'A capacidade deve ser maior ou igual a 1.'),
});

export type RouteFormData = z.infer<typeof routeSchema>;
