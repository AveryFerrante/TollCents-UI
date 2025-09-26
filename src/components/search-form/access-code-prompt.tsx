import { Lock } from "@mui/icons-material";
import { Button, OutlinedInput, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { validateAccessCode } from "../../services/api-service";
import { accessCodeStorage } from "../../services/local-storage-service";

interface AccessCodePromptProps {
  onAccessCodeSet: (code: string) => void;
}

const AccessCodePrompt = ({ onAccessCodeSet }: AccessCodePromptProps) => {
  // TODO: Validate access code server side too?
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await validateAccessCode(accessCodeInput);
    if (!response.isValidAccessCode) {
      setErrorMessage("Invalid access code. Please try again.");
    } else {
      accessCodeStorage.set(accessCodeInput);
      onAccessCodeSet(accessCodeInput);
    }
    setIsLoading(false);
  };

  return (
    <Stack spacing={2} alignItems="center">
      <Typography variant="body1" color="textSecondary" textAlign="center">
        An access code is required to use this application. Please enter a valid
        access code.
      </Typography>
      <Stack direction="row" width="100%" spacing={2}>
        <OutlinedInput
          placeholder="Access Code"
          startAdornment={<Lock sx={{ mr: 2 }} color="disabled" />}
          onChange={(e) => setAccessCodeInput(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          disabled={accessCodeInput.length === 0}
          onClick={handleSubmit}
          sx={{ px: 4 }}
          loading={isLoading}
        >
          Submit
        </Button>
      </Stack>
      {errorMessage && (
        <Typography variant="subtitle2" color="error" width="100%">
          {errorMessage}
        </Typography>
      )}
    </Stack>
  );
};

export default AccessCodePrompt;
