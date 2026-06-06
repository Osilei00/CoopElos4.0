'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

// ============================================
// COLLABORATORS
// ============================================

export function useCollaborators(search?: string) {
  return useQuery({
    queryKey: ['collaborators', search],
    queryFn: async () => {
      const { data } = await api.get('/collaborators', {
        params: { search },
      });
      return data;
    },
  });
}

export function useCollaborator(id: string) {
  return useQuery({
    queryKey: ['collaborator', id],
    queryFn: async () => {
      const { data } = await api.get(`/collaborators/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { data: result } = await api.post('/collaborators', data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
    },
  });
}

export function useUpdateCollaborator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result } = await api.put(`/collaborators/${id}`, data);
      return result;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['collaborators'] });
      queryClient.invalidateQueries({ queryKey: ['collaborator', id] });
    },
  });
}

// ============================================
// ADHESION FORM
// ============================================

export function useAdhesionForm(collaboratorId: string) {
  return useQuery({
    queryKey: ['adhesion-form', collaboratorId],
    queryFn: async () => {
      const { data } = await api.get(
        `/collaborators/${collaboratorId}/adhesion-form`,
      );
      return data;
    },
    enabled: !!collaboratorId,
  });
}

export function useUpsertAdhesionForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collaboratorId,
      data,
    }: {
      collaboratorId: string;
      data: any;
    }) => {
      const { data: result } = await api.post(
        `/collaborators/${collaboratorId}/adhesion-form`,
        data,
      );
      return result;
    },
    onSuccess: (_, { collaboratorId }) => {
      queryClient.invalidateQueries({
        queryKey: ['adhesion-form', collaboratorId],
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

// ============================================
// TIMESHEETS
// ============================================

export function useHospitalTimesheets(year?: number, month?: number) {
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

export function useSadTimesheets(year?: number, month?: number) {
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

// ============================================
// DOCUMENTS
// ============================================

export function useDocuments(collaboratorId: string) {
  return useQuery({
    queryKey: ['documents', collaboratorId],
    queryFn: async () => {
      const { data } = await api.get(
        `/documents/collaborator/${collaboratorId}`,
      );
      return data;
    },
    enabled: !!collaboratorId,
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
  });
}
