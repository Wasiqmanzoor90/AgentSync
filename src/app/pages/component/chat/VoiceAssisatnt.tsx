import React, { useEffect } from 'react';
import { Button, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceInputProps {
  onTranscriptChange: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscriptChange, disabled }) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    onTranscriptChange(transcript);
  }, [transcript]);

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  if (!browserSupportsSpeechRecognition) return null;

  return (
    <Tooltip title={listening ? 'Stop voice input' : 'Start voice input'}>
      <Button
        variant={listening ? 'contained' : 'outlined'}
        color={listening ? 'error' : 'primary'}
        onClick={toggleListening}
        disabled={disabled}
        sx={{ minWidth: 48, height: 48, borderRadius: 3 }}
      >
        {listening ? <StopIcon fontSize="small" /> : <MicIcon fontSize="small" />}
      </Button>
    </Tooltip>
  );
};

export default VoiceInput;
  