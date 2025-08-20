"use client"

import { Box } from '@mui/material'
import React from 'react'
import Lottie from 'lottie-react';

function LoadingData() {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            height="100vh"
        >
            <Box width={200}>
                <Lottie animationData={require('@/../public/animation/Animation - 1748109841865.json')} loop={true} />
            </Box>
        </Box>
    )
}

export default LoadingData