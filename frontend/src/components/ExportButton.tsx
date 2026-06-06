'use client';

import { useState } from 'react';
import { Button, useToast, Icon } from '@chakra-ui/react';
import { HiArrowDownTray, HiArrowPath } from 'react-icons/hi2';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

interface ExportButtonProps {
  type: 'payroll' | 'timesheet_hospital' | 'timesheet_sad';
  id: string;
  label?: string;
}

export function ExportButton({ type, id, label = 'Exportar PDF' }: ExportButtonProps) {
  const toast = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportMutation = useMutation({
    mutationFn: async () => {
      let endpoint: string;

      switch (type) {
        case 'payroll':
          endpoint = `/payrolls/${id}/export`;
          break;
        case 'timesheet_hospital':
          endpoint = `/timesheets/hospital/${id}/export`;
          break;
        case 'timesheet_sad':
          endpoint = `/timesheets/sad/${id}/export`;
          break;
        default:
          throw new Error('Unknown export type');
      }

      const { data } = await api.post(endpoint);
      return data as { success: boolean; data?: string; filename?: string; error?: string };
    },
    onMutate: () => {
      setIsExporting(true);
    },
    onSuccess: async (data) => {
      if (data.success && data.data) {
        // Create blob and download
        const base64Data = data.data;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = data.filename || 'documento.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast({
          title: 'PDF gerado com sucesso',
          status: 'success',
          duration: 3000,
        });
      } else {
        setIsExporting(false);
        toast({
          title: 'Erro ao gerar PDF',
          description: data.error || 'Tente novamente',
          status: 'error',
          duration: 5000,
        });
      }
    },
    onError: () => {
      setIsExporting(false);
      toast({
        title: 'Erro ao iniciar exportação',
        status: 'error',
        duration: 3000,
      });
    },
  });

  return (
    <Button
      leftIcon={<Icon as={isExporting ? HiArrowPath : HiArrowDownTray} />}
      colorScheme="blue"
      variant="outline"
      onClick={() => exportMutation.mutate()}
      isLoading={isExporting}
      loadingText="Gerando PDF..."
    >
      {label}
    </Button>
  );
}
