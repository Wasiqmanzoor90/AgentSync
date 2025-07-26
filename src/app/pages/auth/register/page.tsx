"use client"
import { Box, Button, Container, Input } from '@mui/material';
import Link from 'next/link';
import React from 'react'

function RegisterForm() {
    const RegisterHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formdata = new FormData(e.currentTarget)
        const name = formdata.get("name");
        const email = formdata.get("email");
        const password = formdata.get("password");
       try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log('Login success:', data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };
    

    return (
        <Container  maxWidth="sm">
        <Box component="form" onSubmit={RegisterHandler} display="flex" flexDirection="column" gap={2}>
            <Input name='name' placeholder='name'/>
            <Input name='email' placeholder='email'/>
            <Input name='password' placeholder='password'/>
             <Button type="submit" variant="contained">Register</Button>
             
        </Box>
        <Link href ="/pages/auth/login">
        <Button>Already have an account? signin</Button>
        </Link>
        </Container>
    )
}

export default RegisterForm