import React, { useState } from 'react';
import { Button, Typography, Box, Paper, CircularProgress, IconButton, Tooltip } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useSpeechRecognition } from 'react-speech-recognition';
import { sendMessage } from '../../../../../lib/openai';


const SpeechToText = () => {
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    startListening,
    stopListening
  } = useSpeechRecognition();

  const handleSendToAI = async () => {
    if (!transcript) return;
    
    setIsProcessing(true);
    try {
      const response : any = await sendMessage(transcript);
      setAiResponse(response);
    } catch (error) {
      console.error('Error calling AI:', error);
      setAiResponse("Sorry, I encountered an error processing your request.");
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Text-to-speech not supported in this browser');
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Box sx={{ padding: 2 }}>
        <Typography color="error">
          Your browser does not support speech recognition. Please try Chrome, Edge, or Firefox.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, maxWidth: 'md', margin: '0 auto' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        AI Voice Assistant
      </Typography>

      <Paper elevation={3} sx={{ padding: 3, mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Your speech
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, minHeight: 60, mb: 2 }}>
          <Typography variant="body1" color={transcript ? 'text.primary' : 'text.disabled'}>
            {transcript || 'Speak to see your words appear here...'}
          </Typography>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color={listening ? 'error' : 'primary'}
            startIcon={listening ? <StopIcon /> : <MicIcon />}
            onClick={listening ? stopListening : () => startListening()}
            fullWidth
          >
            {listening ? 'Stop Listening' : 'Start Speaking'}
          </Button>

          <Tooltip title="Reset conversation">
            <IconButton
              color="default"
              onClick={() => {
                resetTranscript();
                setAiResponse('');
              }}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" color="text.secondary">
            AI Response
          </Typography>
          {aiResponse && (
            <Tooltip title="Read aloud">
              <IconButton onClick={() => speak(aiResponse)}>
                <VolumeUpIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Paper variant="outlined" sx={{ p: 2, minHeight: 120 }}>
          {isProcessing ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100 }}>
              <CircularProgress />
            </Box>
          ) : aiResponse ? (
            <Typography variant="body1">{aiResponse}</Typography>
          ) : (
            <Typography variant="body1" color="text.disabled">
              {transcript ? 'Press the button below to get AI response' : 'Speak first to get an AI response'}
            </Typography>
          )}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSendToAI}
            disabled={!transcript || isProcessing}
            sx={{ minWidth: 200 }}
          >
            Get AI Response
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SpeechToText;