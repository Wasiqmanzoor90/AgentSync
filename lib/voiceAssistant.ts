'use client';

import { useState } from 'react';
import {useSpeechRecognition} from 'react-speech-recognition'

export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser doesn't support speech recognition.");
  }

  const startListening = () => {
    resetTranscript();
    setIsListening(true);
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return {
    transcript,
    isListening: listening,
    response,
    isProcessing,
    startListening,
    stopListening,
    speak,
    setResponse,
    setIsProcessing
  };
};