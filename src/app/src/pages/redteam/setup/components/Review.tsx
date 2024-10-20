import React, { useState, useEffect } from 'react';
import InlineEmailEditor from '@app/components/InlineEmailEditor';
import { useGlobalStore } from '@app/stores/globalStore';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { RedteamPlugin, RedteamStrategy } from '@promptfoo/redteam/types';
import { useRedTeamConfig } from '../hooks/useRedTeamConfig';
import { generateOrderedYaml } from '../utils/yamlHelpers';

export default function Review() {
  const { config, updateConfig, sendConfig } = useRedTeamConfig();
  const { userEmail } = useGlobalStore();
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    setIsEmailValid(!!userEmail);
  }, [userEmail]);

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig('description', event.target.value);
  };

  const handleEmailValidityChange = (isValid: boolean) => {
    setIsEmailValid(isValid);
  };

  const handleSaveYaml = async () => {
    if (!isEmailValid || !userEmail) {
      alert('Please enter a valid email address before downloading the configuration.');
      return;
    }
    setIsSending(true);
    setSendError(null);
    try {
      await sendConfig(userEmail);
      const yamlContent = generateOrderedYaml(config);
      const blob = new Blob([yamlContent], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'promptfooconfig.yaml';
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setSendError('Failed to send config copy. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const getPluginLabel = (plugin: string | RedteamPlugin) => {
    return typeof plugin === 'string' ? plugin : plugin.id;
  };

  const getStrategyLabel = (strategy: string | RedteamStrategy) => {
    return typeof strategy === 'string' ? strategy : strategy.id;
  };

  return (
    <Box maxWidth="lg" mx="auto">
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Review Your Configuration
      </Typography>

      <TextField
        fullWidth
        label="Configuration Description"
        placeholder="My Red Team Configuration"
        value={config.description}
        onChange={handleDescriptionChange}
        variant="outlined"
        sx={{ mb: 4 }}
      />

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Configuration Summary
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Plugins ({config.plugins?.length || 0})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {config.plugins?.map((plugin, index) => (
                <Chip key={index} label={getPluginLabel(plugin)} size="small" />
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Strategies ({config.strategies?.length || 0})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {config.strategies?.map((strategy, index) => (
                <Chip key={index} label={getStrategyLabel(strategy)} size="small" />
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Additional Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Purpose</Typography>
                <Typography variant="body2">{config.purpose || 'Not specified'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Entities</Typography>
                <Typography variant="body2">{config.entities?.join(', ') || 'None'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Running Your Configuration
      </Typography>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="body1" paragraph>
          Follow these steps to run your red team configuration:
        </Typography>
        <ol>
          <li>
            <Typography variant="body1" paragraph>
              Enter your email and save your configuration as a YAML file. A copy will also be sent
              to your email:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              <InlineEmailEditor onValidityChange={handleEmailValidityChange} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  A copy of the configuration will be sent to this email.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveYaml}
                  disabled={!isEmailValid || isSending}
                >
                  {isSending ? <CircularProgress size={24} /> : 'Save YAML'}
                </Button>
              </Box>
            </Box>
            {!isEmailValid && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Please enter a valid email address to receive and download the configuration.
              </Alert>
            )}
            {sendError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {sendError}
              </Alert>
            )}
          </li>
          <li>
            <Typography variant="body1" paragraph>
              Open your terminal in the directory containing your configuration file, and run:
            </Typography>
            <Box
              component="pre"
              sx={{
                p: 2,
                backgroundColor: 'grey.100',
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '0.875rem',
              }}
            >
              promptfoo redteam run
            </Box>
          </li>
        </ol>
      </Paper>
    </Box>
  );
}
