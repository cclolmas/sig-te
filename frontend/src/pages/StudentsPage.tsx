import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button as MuiButton, TextField, Checkbox, FormControlLabel, Alert, AlertTitle,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Stepper, Step, StepLabel, Stack, FormGroup, Button,
} from '@mui/material';
import QRCode from 'react-qr-code';
import { useTheme } from '../context/ThemeContext';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import ThemeToggle from '../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const MOCK_ESCOLAS = ['CEF 07 de Brasília', 'Escola Classe Jardim Botânico', 'CED GISNO', 'EC 108 SUL', 'CED 02 DO CRUZEIRO'];
const STEPS = ['Dados do Estudante', 'Critérios e Necessidades', 'Declarações e Envio'];

const StudentsPage: React.FC = () => {
  // --- State Management ---
  const [activeStep, setActiveStep] = useState(0);
  // Form Data State
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [escola, setEscola] = useState('');
  const [necessidadeEspecial, setNecessidadeEspecial] = useState(false);
  const [requerAcompanhante, setRequerAcompanhante] = useState(false);
  const [laudoAnexado, setLaudoAnexado] = useState(false); // Simula anexo de arquivo
  const [possuiPasseLivre, setPossuiPasseLivre] = useState(false);
  const [cienteCompromissos, setCienteCompromissos] = useState(false);
  // Control State
  const [alunoCadastrado, setAlunoCadastrado] = useState<{ id: string; name: string; status: string; escola: string; protocolo: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#F8F9FA' : '#18181b';
  }, [theme]);

  const handleNext = () => {
    setError('');
    // Validação por passo
    if (activeStep === 0 && (!nome || !cpf || !escola || !endereco || !cep || !googleMapsLink)) {
      setError('Preencha todos os dados do estudante para prosseguir.');
      return;
    }
    if (activeStep === 2 && (!cienteCompromissos || possuiPasseLivre)) {
      setError('É necessário aceitar os termos e confirmar que o aluno NÃO possui Passe Livre.');
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleEnviarSolicitacao = () => {
    setLoading(true);
    setError('');
    // Simulação de envio
    setTimeout(() => {
      if (possuiPasseLivre) {
        setError('Concessão negada. O estudante já é beneficiário do Passe Livre Estudantil.');
        setLoading(false);
        return;
      }
      if (!cienteCompromissos) {
        setError('É obrigatório confirmar a ciência dos compromissos do responsável.');
        setLoading(false);
        return;
      }

      let status = 'Regular';
      if (necessidadeEspecial) status = 'PCD';
      if (requerAcompanhante) status = 'PCD com Acompanhante';

      const novoAluno = {
        id: cpf,
        name: nome,
        status: status,
        escola: escola,
        protocolo: `SEI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      };
      setAlunoCadastrado(novoAluno);
      setLoading(false);
      handleNext(); // Avança para a tela de sucesso
    }, 1500);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // Dados do Estudante
        return (
          <Stack spacing={2} mt={3}>
            <Typography variant="h6">1. Identificação do Estudante</Typography>
            <TextField label="Nome Completo do Aluno" value={nome} onChange={e => setNome(e.target.value)} required />
            <TextField label="CPF do Aluno (somente números)" value={cpf} onChange={e => setCpf(e.target.value)} required inputProps={{ maxLength: 11 }} />
            <FormControl fullWidth required>
              <InputLabel>Unidade Escolar</InputLabel>
              <Select value={escola} label="Unidade Escolar" onChange={e => setEscola(e.target.value)}>
                {MOCK_ESCOLAS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Endereço Completo" value={endereco} onChange={e => setEndereco(e.target.value)} required />
            <TextField label="CEP" value={cep} onChange={e => setCep(e.target.value)} required inputProps={{ maxLength: 9 }} />
            <TextField label="Link do Google Maps" value={googleMapsLink} onChange={e => setGoogleMapsLink(e.target.value)} required />
          </Stack>
        );
      case 1: // Critérios e Necessidades
        return (
          <Stack spacing={2} mt={3}>
            <Typography variant="h6">2. Necessidades Especiais</Typography>
            <Alert severity="info">Seção baseada no formulário "Adequacao.txt". Preencha apenas se aplicável.</Alert>
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={necessidadeEspecial} onChange={e => setNecessidadeEspecial(e.target.checked)} />} label="O estudante possui alguma Necessidade Especial (PCD)?" />
              {necessidadeEspecial && (
                <Box pl={4} mt={2} borderLeft={2} borderColor="divider">
                  <FormControlLabel control={<Checkbox checked={requerAcompanhante} onChange={e => setRequerAcompanhante(e.target.checked)} />} label="Necessita de acompanhante no transporte?" />
                  <FormControlLabel control={<Checkbox checked={laudoAnexado} onChange={e => setLaudoAnexado(e.target.checked)} />} label="Declaro que o laudo médico foi anexado ao processo SEI." />
                </Box>
              )}
            </FormGroup>
          </Stack>
        );
      case 2: // Declarações e Envio
        return (
          <Stack spacing={3} mt={3}>
            <Typography variant="h6">3. Declarações Obrigatórias</Typography>
            {/* Alerta sobre LGPD - Ref: despachos.txt (template 018) */}
            <Alert severity="warning">
              <AlertTitle>Atenção à Lei Geral de Proteção de Dados (LGPD)</AlertTitle>
              Ao submeter esta solicitação, você está lidando com dados pessoais sensíveis. É sua responsabilidade garantir que o processo SEI correspondente seja criado com <strong>nível de acesso RESTRITO</strong>.
            </Alert>
            <FormGroup>
              {/* Verificação do Passe Livre - Ref: Portaria 192 */}
              <FormControlLabel
                control={<Checkbox checked={possuiPasseLivre} onChange={e => setPossuiPasseLivre(e.target.checked)} />}
                label="Declaro que o estudante JÁ POSSUI o benefício do Passe Livre Estudantil."
              />
              {possuiPasseLivre && <Typography color="error.main" variant="caption">Esta opção impedirá a solicitação de ser aprovada.</Typography>}

              {/* Verificação dos Compromissos - Ref: Adequacao.txt */}
              <FormControlLabel
                control={<Checkbox checked={cienteCompromissos} onChange={e => setCienteCompromissos(e.target.checked)} />}
                label="Declaro que o responsável pelo aluno foi informado sobre seus compromissos (frequência, horários, etc.) e assinou o Formulário de Adesão, que será anexado ao processo SEI."
                required
              />
            </FormGroup>
          </Stack>
        );
      default:
        return 'Passo desconhecido';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', p: { xs: 2, sm: 4 }, color: theme === 'light' ? '#212529' : '#F8F9FA', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}><IconButton color="primary" onClick={() => navigate('/')}><HomeIcon /></IconButton></Box>
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}><ThemeToggle /></Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, boxShadow: 4, maxWidth: 800, width: '100%' }}>
        <Typography variant="h4" fontWeight={700} mb={1}>Assistente de Solicitação de Transporte Escolar</Typography>
        <Stepper activeStep={activeStep} sx={{ my: 3 }}>
          {STEPS.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        {activeStep === STEPS.length ? (
          // Tela de Sucesso
          <Stack spacing={2} alignItems="center" textAlign="center">
            <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
            <Typography variant="h5" fontWeight={600}>Solicitação Registrada!</Typography>
            <Alert severity="success" sx={{ width: '100%', textAlign: 'left' }}>
              <AlertTitle>Protocolo Gerado: <strong>{alunoCadastrado?.protocolo}</strong></AlertTitle>
              A carteirinha provisória está disponível abaixo. A solicitação será analisada pela UNIAE/GCOTE.
            </Alert>
            <Box>
              <Typography variant="h6">Próximos Passos (Gestor):</Typography>
              <List dense>
                <ListItem>1. Inicie um processo no SEI com o protocolo acima.</ListItem>
                <ListItem>2. Anexe o "Formulário de Requerimento e Adesão" assinado pelo responsável.</ListItem>
                <ListItem>3. Se aplicável, anexe o laudo médico do estudante.</ListItem>
                <ListItem>4. Encaminhe o processo para a UNIAE.</ListItem>
              </List>
            </Box>
            <QRCode value={JSON.stringify(alunoCadastrado)} size={128} />
            <Button variant="outlined" onClick={() => setActiveStep(0)}>Registrar Nova Solicitação</Button>
          </Stack>
        ) : (
          // Conteúdo dos Passos
          <React.Fragment>
            {getStepContent(activeStep)}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Voltar</Button>
              {activeStep === STEPS.length - 1 ? (
                <Button variant="contained" onClick={handleEnviarSolicitacao} disabled={loading}>
                  {loading ? <CircularProgress size={24} /> : 'Finalizar e Gerar Protocolo'}
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>Próximo</Button>
              )}
            </Box>
          </React.Fragment>
        )}
      </Paper>
    </Box>
  );
};

export default StudentsPage;
