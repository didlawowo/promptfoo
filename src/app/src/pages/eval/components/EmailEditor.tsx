import React, { useState } from 'react';
import { callApi } from '@app/utils/api';
import EditIcon from '@mui/icons-material/Edit';
import { Chip, Popover, TextField, Button, Box, Tooltip, CircularProgress } from '@mui/material';
import { ApiSchemas } from '@server/apiSchemas';
import { useStore } from './store';

const EmailEditor: React.FC = () => {
  const { author, setAuthor } = useStore();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [email, setEmail] = useState(author || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setEmail(author || '');
    setError(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await callApi('/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to update email');
      }

      const result = await response.json();
      ApiSchemas.Email.Update.Response.parse(result);

      setAuthor(email);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'email-popover' : undefined;

  return (
    <>
      <Tooltip title={author ? 'Click to edit' : 'Set eval author'}>
        <Chip
          icon={<EditIcon fontSize="small" />}
          label={author ? `Author: ${author}` : 'Set author'}
          onClick={handleClick}
          sx={{
            height: '24px',
            '& .MuiChip-label': {
              fontSize: '0.75rem',
              padding: '0 8px',
            },
            '& .MuiChip-icon': {
              fontSize: '1rem',
              marginLeft: '8px',
            },
            opacity: 0.7,
            cursor: 'pointer',
          }}
        />
      </Tooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-end' }}>
          <TextField
            label="Email"
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            helperText={error}
            disabled={isLoading}
          />
          <Button onClick={handleSave} sx={{ ml: 1 }} disabled={isLoading || !email}>
            {isLoading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default EmailEditor;
