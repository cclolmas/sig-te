import React, { useState } from 'react';
import {
  TextField, Box, IconButton, Paper, Typography, Grid, Button, Alert, AlertTitle, Stack,
  Select, MenuItem, InputLabel, FormControl, FormHelperText,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { UploadFile } from '@mui/icons-material';

// --- Reusable Form Field Components ---

// InputField (Original, aprimorado com Controller para melhor integração)
export type InputFieldProps = { name: string; label: string; control: any; error?: any; [key: string]: any; };
export function InputField({ name, label, control, error, ...props }: InputFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField {...field} label={label} fullWidth margin="normal" error={!!error} helperText={error?.message} {...props} />
      )}
    />
  );
}

// TextareaField (Novo, para justificativas e observações)
export type TextareaFieldProps = { name: string; label: string; control: any; error?: any; [key: string]: any; };
export function TextareaField({ name, label, control, error, ...props }: TextareaFieldProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField {...field} label={label} fullWidth margin="normal" multiline minRows={4} error={!!error} helperText={error?.message} {...props} />
      )}
    />
  );
}

// SelectField (Novo, essencial para o sistema)
export type SelectFieldProps = { name: string; label: string; control: any; error?: any; children: React.ReactNode; };
export function SelectField({ name, label, control, error, children }: SelectFieldProps) {
  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select {...field} label={label}>
            {children}
          </Select>
        )}
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
}

// FileUploadField (Novo, para anexos obrigatórios)
export function FileUploadField({ name, label, control, error }: { name: string; label: string; control: any; error?: any; }) {
  return (
    <Box sx={{ mt: 2, mb: 1 }}>
      <Button variant="outlined" component="label" startIcon={<UploadFile />}>
        {label}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input type="file" hidden onChange={(e) => field.onChange(e.target.files)} />
          )}
        />
      </Button>
      {error && <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>{error.message}</Typography>}
    </Box>
  );
}


// --- Página de Demonstração dos Componentes ---

// Schema de validação para o formulário de demonstração
const showcaseSchema = z.object({
  nomeAluno: z.string().min(3, 'Nome é obrigatório'),
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  unidadeEscolar: z.string().nonempty('Selecione uma unidade escolar'),
  justificativa: z.string().min(10, 'Justificativa é necessária'),
  laudoMedico: z.any().refine(files => files?.length > 0, 'O anexo do laudo é obrigatório.'),
});

export default function FormComponentsShowcasePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(showcaseSchema),
    defaultValues: { nomeAluno: '', cpf: '', unidadeEscolar: '', justificativa: '', laudoMedico: null },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    alert('Formulário de demonstração enviado com sucesso! Verifique o console.');
  };

  React.useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#F8F9FA' : '#18181b';
  }, [theme]);

  return (
    <Box sx={{ p: 4, color: theme === 'light' ? '#212529' : '#F8F9FA', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <IconButton color="primary" onClick={() => navigate('/')}><HomeIcon /></IconButton>
      </Box>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <ThemeToggle />
      </Box>

      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={700} mb={1}>Guia de Componentes de Formulário - SIG-TE</Typography>
        <Typography color="text.secondary" mb={4}>
          Esta página demonstra os componentes de formulário padronizados para uso em todo o sistema, garantindo consistência e conformidade com as regras de negócio.
        </Typography>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" component="h2" mb={2}>Demonstração Prática</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <InputField name="nomeAluno" label="Nome do Aluno" control={control} error={errors.nomeAluno} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <InputField name="cpf" label="CPF (somente números)" control={control} error={errors.cpf} />
              </Grid>
              <Grid item xs={12}>
                <SelectField name="unidadeEscolar" label="Unidade Escolar" control={control} error={errors.unidadeEscolar}>
                  <MenuItem value=""><em>Selecione...</em></MenuItem>
                  <MenuItem value="CEF 07">CEF 07 de Brasília</MenuItem>
                  <MenuItem value="ECJB">Escola Classe Jardim Botânico</MenuItem>
                  <MenuItem value="CEDGISNO">CED GISNO</MenuItem>
                </SelectField>
              </Grid>
              <Grid item xs={12}>
                <TextareaField name="justificativa" label="Justificativa para Solicitação Especial" control={control} error={errors.justificativa} />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mt: 1 }}>
                  <strong>Contexto de Uso:</strong> O campo de upload é obrigatório para processos que exigem documentação comprobatória, como a inclusão de alunos PCD (laudo médico) ou solicitações de atividades extracurriculares (lista nominal de alunos).
                </Alert>
                <FileUploadField name="laudoMedico" label="Anexar Laudo Médico" control={control} error={errors.laudoMedico} />
                <Alert severity="warning" sx={{ mt: 1 }}>
                  <strong>Atenção à LGPD:</strong> Ao utilizar este componente para upload de documentos contendo dados pessoais, certifique-se de que o processo SEI correspondente tenha o nível de acesso "Restrito" para cumprir a Lei Geral de Proteção de Dados.
                </Alert>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>Enviar Demonstração</Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mt: 4 }}>
          <Typography variant="h6" component="h2" mb={2}>Boas Práticas e Diretrizes</Typography>
          <Stack spacing={2}>
            <Typography><strong>Consistência:</strong> Utilize sempre estes componentes reutilizáveis em vez de criar campos de formulário do zero.</Typography>
            <Typography><strong>Validação:</strong> Toda entrada de usuário deve ser validada. Utilize `zod` para definir os schemas de validação, conforme os requisitos de cada formulário (ex: CPF, datas, campos obrigatórios).</Typography>
            <Typography><strong>Acessibilidade:</strong> Garanta que todos os campos tenham um `label` associado e que as mensagens de erro sejam claras e descritivas.</Typography>
            <Typography><strong>Feedback:</strong> Forneça feedback claro ao usuário após a submissão, indicando sucesso, erro ou o próximo passo no processo (ex: "Sua solicitação foi enviada para análise na GCOTE").</Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
