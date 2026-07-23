'use client';

import {
  FormControl,
  FormLabel,
  Checkbox,
  CheckboxGroup,
  Stack,
  Input,
  Box,
  Text,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const ACTIVITY_OPTIONS = [
  'Atividades de enfermagem',
  'Serviços combinados para apoio a edifícios, exceto condomínios prediais',
  'Limpeza em prédios e em domicílios',
  'Atividades de vigilância e segurança privada',
  'Atividades de contabilidade',
  'Serviços combinados de escritório e apoio administrativo',
  'Atividades de atendimento em pronto socorro e unidades hospitalares para atendimento a urgências',
  'Atividades de profissionais da nutrição',
  'Atividades de psicologia e psicanálise',
  'Atividades de fisioterapia',
  'Atividades de profissionais da área de saúde',
  'Atividades de limpeza',
  'Condomínios prediais',
  'Manutenção de jardins e gramados',
  'Serviços domésticos',
  'Preparação de documentos e serviços especializados de apoio administrativo',
  'Outras atividades de serviços de segurança',
  'Atividades de apoio à gestão de saúde',
  'Atividades de práticas integrativas e complementares em saúde humana',
  'Atividade médica ambulatorial com recursos para realização de exames complementares',
  'Atividade odontológica',
  'Atividades de assistência social prestadas em residências coletivas e particulares',
  'Lavanderias',
  'Outras atividades de serviços prestados principalmente às empresas',
  'Corretores e agentes de seguros, de planos de previdência complementar e de saúde',
  'Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica',
  'Auditoria e consultoria atuarial',
  'Atividades de consultoria e auditoria contábil e tributária',
  'Atividades de apoio à educação, exceto caixas escolares',
  'Atividades de assistência a deficientes físicos, imunodeprimidos e convalescentes',
  'Atividades de fornecimento de infraestrutura de apoio e assistência a paciente no domicílio',
];

const OUTROS_VALUE = '__OUTROS__';

export function serializeActivities(selected: string[], outrosText: string): string | null {
  const items = selected.map((s) => (s === OUTROS_VALUE ? `Outros: ${outrosText}` : s));
  return items.length > 0 ? items.join(', ') : null;
}

export function deserializeActivities(value: string | null | undefined): { selected: string[]; outrosText: string } {
  if (!value) return { selected: [], outrosText: '' };
  const parts = value.split(', ').map((s) => s.trim());
  const selected: string[] = [];
  let outrosText = '';
  for (const part of parts) {
    if (part.startsWith('Outros: ')) {
      selected.push(OUTROS_VALUE);
      outrosText = part.replace('Outros: ', '');
    } else if (ACTIVITY_OPTIONS.includes(part)) {
      selected.push(part);
    }
  }
  return { selected, outrosText };
}

interface ActivityCheckboxGroupProps {
  label: string;
  value: string | null | undefined;
  onChange: (value: string | null) => void;
}

export function ActivityCheckboxGroup({ label, value, onChange }: ActivityCheckboxGroupProps) {
  const { selected: initialSelected, outrosText: initialOutros } = deserializeActivities(value);
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const [outrosText, setOutrosText] = useState(initialOutros);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!hydrated && value !== undefined) {
      const { selected: s, outrosText: t } = deserializeActivities(value);
      setSelected(s);
      setOutrosText(t);
      setHydrated(true);
    }
  }, [value, hydrated]);

  const handleChange = (newSelected: string[]) => {
    setSelected(newSelected);
    if (!newSelected.includes(OUTROS_VALUE)) {
      setOutrosText('');
    }
    onChange(serializeActivities(newSelected, newSelected.includes(OUTROS_VALUE) ? outrosText : ''));
  };

  const handleOutrosChange = (text: string) => {
    setOutrosText(text);
    onChange(serializeActivities(selected, text));
  };

  const isOutrosChecked = selected.includes(OUTROS_VALUE);

  return (
    <FormControl>
      <FormLabel fontSize="sm" fontWeight="600">{label}</FormLabel>
      <CheckboxGroup value={selected} onChange={handleChange}>
        <Stack spacing={2} maxH="300px" overflowY="auto" pr={2}>
          {ACTIVITY_OPTIONS.map((option) => (
            <Checkbox key={option} value={option} size="sm" alignItems="flex-start">
              <Text fontSize="sm">{option}</Text>
            </Checkbox>
          ))}
          <Checkbox value={OUTROS_VALUE} size="sm" alignItems="flex-start">
            <Text fontSize="sm" fontWeight="500">Outros</Text>
          </Checkbox>
        </Stack>
      </CheckboxGroup>
      {isOutrosChecked && (
        <Box mt={2}>
          <Input
            size="sm"
            placeholder="Descreva a atividade..."
            value={outrosText}
            onChange={(e) => handleOutrosChange(e.target.value)}
          />
        </Box>
      )}
    </FormControl>
  );
}
