'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// ============================================
// TYPES
// ============================================

interface User {
  id: string;
  name: string;
  username: string | null;
  email: string;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

// ============================================
// SESSION
// ============================================

export { useSession } from './useSession';

// ============================================
// DASHBOARD
// ============================================

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats');
      return data;
    },
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
}

// ============================================
// COOPERADOS
// ============================================

export function useCooperados(search?: string) {
  return useQuery({
    queryKey: ['cooperados', search],
    queryFn: async () => {
      const { data } = await api.get('/cooperados', {
        params: { search },
      });
      return data;
    },
  });
}

export function useCooperado(id: string) {
  return useQuery({
    queryKey: ['cooperado', id],
    queryFn: async () => {
      const { data } = await api.get(`/cooperados/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateCooperado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: result } = await api.post('/cooperados', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cooperados'] });
    },
  });
}

export function useUpdateCooperado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result } = await api.put(`/cooperados/${id}`, data);
      return result;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['cooperados'] });
      queryClient.invalidateQueries({ queryKey: ['cooperado', id] });
    },
  });
}

export function useDeleteCooperado() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: result } = await api.delete(`/cooperados/${id}`);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cooperados'] });
    },
  });
}

// ============================================
// ADHESION FORM
// ============================================

export function useAdhesionForm(cooperadoId: string) {
  return useQuery({
    queryKey: ['adhesion-form', cooperadoId],
    queryFn: async () => {
      const { data } = await api.get(
        `/cooperados/${cooperadoId}/adhesion-form`,
      );
      return data;
    },
    enabled: !!cooperadoId,
  });
}

export function useUpsertAdhesionForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cooperadoId,
      data,
    }: {
      cooperadoId: string;
      data: any;
    }) => {
      const { data: result } = await api.post(
        `/cooperados/${cooperadoId}/adhesion-form`,
        data,
      );
      return result;
    },
    onSuccess: (_, { cooperadoId }) => {
      queryClient.invalidateQueries({
        queryKey: ['adhesion-form', cooperadoId],
      });
    },
  });
}

// ============================================
// CONTRACT HISTORY
// ============================================

export function useContractHistory(cooperadoId: string) {
  return useQuery({
    queryKey: ['contract-history', cooperadoId],
    queryFn: async () => {
      const { data } = await api.get(
        `/cooperados/${cooperadoId}/history`,
      );
      return data;
    },
    enabled: !!cooperadoId,
  });
}

export function useCreateContractHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cooperadoId,
      data,
    }: {
      cooperadoId: string;
      data: {
        cargo?: string;
        salario?: number;
        data_admissao?: string;
        data_saida?: string;
        motivo?: string;
        observacoes?: string;
      };
    }) => {
      const { data: result } = await api.post(
        `/cooperados/${cooperadoId}/history`,
        data,
      );
      return result;
    },
    onSuccess: (_, { cooperadoId }) => {
      queryClient.invalidateQueries({
        queryKey: ['contract-history', cooperadoId],
      });
    },
  });
}

// ============================================
// PAYROLLS
// ============================================

export function usePayrolls(year?: number, month?: number) {
  return useQuery({
    queryKey: ['payrolls', year, month],
    queryFn: async () => {
      const { data } = await api.get('/payrolls', {
        params: { year, month },
      });
      return data;
    },
  });
}

export function usePayroll(id: string) {
  return useQuery({
    queryKey: ['payroll', id],
    queryFn: async () => {
      const { data } = await api.get(`/payrolls/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ year, month }: { year: number; month: number }) => {
      const { data } = await api.post('/payrolls', null, {
        params: { year, month },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
    },
  });
}

export function useClosePayroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/payrolls/${id}/close`);
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
      queryClient.invalidateQueries({ queryKey: ['payroll', id] });
    },
  });
}

export function useCreatePayrollItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payrollId, data }: { payrollId: string; data: { cooperado_id: string; gross_amount: number; discounts: number; net_amount: number } }) => {
      const { data: result } = await api.post(`/payrolls/${payrollId}/items`, data);
      return result;
    },
    onSuccess: (_, { payrollId }) => {
      queryClient.invalidateQueries({ queryKey: ['payroll', payrollId] });
      queryClient.invalidateQueries({ queryKey: ['payrolls'] });
    },
  });
}

// ============================================
// TIMESHEETS
// ============================================

export function useTimesheetsHospital(year?: number, month?: number) {
  return useQuery({
    queryKey: ['timesheets', 'hospital', year, month],
    queryFn: async () => {
      const { data } = await api.get('/timesheets/hospital', {
        params: { year, month },
      });
      return data;
    },
  });
}

export function useTimesheetHospital(id: string) {
  return useQuery({
    queryKey: ['timesheets', 'hospital', id],
    queryFn: async () => {
      const { data } = await api.get(`/timesheets/hospital/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useTimesheetsSad(year?: number, month?: number) {
  return useQuery({
    queryKey: ['timesheets', 'sad', year, month],
    queryFn: async () => {
      const { data } = await api.get('/timesheets/sad', {
        params: { year, month },
      });
      return data;
    },
  });
}

export function useTimesheetSad(id: string) {
  return useQuery({
    queryKey: ['timesheets', 'sad', id],
    queryFn: async () => {
      const { data } = await api.get(`/timesheets/sad/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpsertTimesheetHospital() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: result } = await api.post('/timesheets/hospital', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets', 'hospital'] });
    },
  });
}

export function useUpsertTimesheetSad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: result } = await api.post('/timesheets/sad', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets', 'sad'] });
    },
  });
}

// ============================================
// TASKS
// ============================================

export function useTasks(status?: string) {
  return useQuery({
    queryKey: ['tasks', status],
    queryFn: async () => {
      const { data } = await api.get('/tasks', {
        params: { status },
      });
      return data;
    },
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: result } = await api.post('/tasks', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/tasks/${id}/complete`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// ============================================
// VACATIONS
// ============================================

export function useVacations() {
  return useQuery({
    queryKey: ['vacations'],
    queryFn: async () => {
      const { data } = await api.get('/vacations');
      return data;
    },
  });
}

export function useCreateVacation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { cooperado_id: string; start_date: string; end_date: string; days: number }) => {
      const { data: result } = await api.post('/vacations', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacations'] });
    },
  });
}

// ============================================
// DOCUMENTS
// ============================================

export function useDocuments(cooperadoId: string) {
  return useQuery({
    queryKey: ['documents', cooperadoId],
    queryFn: async () => {
      const { data } = await api.get(
        `/documents/cooperado/${cooperadoId}`,
      );
      return data;
    },
    enabled: !!cooperadoId,
  });
}

// ============================================
// CONTRIBUICOES
// ============================================

export function useContribuicoes(filters?: { mes?: number; ano?: number; cooperado_id?: string; status?: string; tipo?: string }) {
  return useQuery({
    queryKey: ['contribuicoes', filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters?.mes) params.mes = String(filters.mes);
      if (filters?.ano) params.ano = String(filters.ano);
      if (filters?.cooperado_id) params.cooperado_id = filters.cooperado_id;
      if (filters?.status) params.status = filters.status;
      if (filters?.tipo) params.tipo = filters.tipo;
      const { data } = await api.get('/contribuicoes', { params });
      return data;
    },
  });
}

export function useContribuicaoStats(ano?: number) {
  return useQuery({
    queryKey: ['contribuicao-stats', ano],
    queryFn: async () => {
      const { data } = await api.get('/contribuicoes/stats', { params: { ano } });
      return data;
    },
  });
}

export function useCreateContribuicao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { cooperado_id: string; valor: number; mes: number; ano: number; tipo?: string; descricao?: string }) => {
      const { data: result } = await api.post('/contribuicoes', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contribuicoes'] });
      queryClient.invalidateQueries({ queryKey: ['contribuicao-stats'] });
    },
  });
}

export function useDeleteContribuicao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/contribuicoes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contribuicoes'] });
      queryClient.invalidateQueries({ queryKey: ['contribuicao-stats'] });
    },
  });
}

// ============================================
// AUDIT
// ============================================

export function useAuditLogs(tableName?: string) {
  return useQuery({
    queryKey: ['audit', tableName],
    queryFn: async () => {
      const { data } = await api.get('/audit', {
        params: { table: tableName },
      });
      return data;
    },
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
}

// ============================================
// USERS
// ============================================

export function useUsers(search?: string) {
  return useQuery<User[]>({
    queryKey: ['users', search],
    queryFn: async () => {
      const { data } = await api.get('/users', {
        params: { search },
      });
      return data;
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      username?: string;
      email: string;
      password: string;
      role: string;
    }) => {
      const { data: result } = await api.post('/users', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        username?: string;
        email?: string;
        role?: string;
        is_active?: boolean;
      };
    }) => {
      const { data: result } = await api.put(`/users/${id}`, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await api.post(`/users/${userId}/reset-password`);
      return data;
    },
  });
}

// ============================================
// PATIENTS
// ============================================

export interface Patient {
  id: string;
  name: string;
  code: string | null;
  created_at: string;
}

export function usePatients(search?: string) {
  return useQuery({
    queryKey: ['patients', search],
    queryFn: async () => {
      const { data } = await api.get('/patients', { params: { search } });
      return data as Patient[];
    },
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { name: string; code?: string }) => {
      const { data: result } = await api.post('/patients', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string; code?: string } }) => {
      const { data: result } = await api.put(`/patients/${id}`, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/patients/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
}
