import React, { useState, useEffect } from 'react';
import { useGlobalStore } from '@app/stores/globalStore';
import EmailIcon from '@mui/icons-material/Email';
import { TextField, InputAdornment } from '@mui/material';

interface InlineEmailEditorProps {
  onValidityChange: (isValid: boolean) => void;
}

const InlineEmailEditor: React.FC<InlineEmailEditorProps> = ({ onValidityChange }) => {
  const { userEmail, setUserEmail } = useGlobalStore();
  const [email, setEmail] = useState(userEmail || '');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(email);
    setError(isValid ? null : 'Please enter a valid email address');
    onValidityChange(isValid);
    return isValid;
  };

  useEffect(() => {
    setEmail(userEmail || '');
    validateEmail(userEmail || '');
  }, [userEmail]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handleBlur = () => {
    if (validateEmail(email)) {
      setUserEmail(email);
    }
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      label="Email"
      type="email"
      value={email}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!error}
      helperText={error}
      placeholder="Enter your email"
      required
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <EmailIcon color="action" />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: error ? 'error.main' : 'transparent',
          },
          '&:hover fieldset': {
            borderColor: error ? 'error.main' : 'rgba(0, 0, 0, 0.23)',
          },
          '&.Mui-focused fieldset': {
            borderColor: error ? 'error.main' : 'primary.main',
          },
        },
      }}
    />
  );
};

export default InlineEmailEditor;
