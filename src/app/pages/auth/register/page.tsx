"use client"
import { Box, Button, Container, Input } from '@mui/material';
import Link from 'next/link';
import React from 'react'
import {signIn} from 'next-auth/react';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google'

function RegisterForm() {

  const githublogin = async()=>{
signIn('github');
  };

   const googlelogin = async()=>{
signIn("google");
  };
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
                <Button
      variant="contained"
      color="inherit"
      startIcon={<GitHubIcon />}
      onClick={githublogin}
      sx={{ mt: 2 }}
    >
      Sign in with GitHub
    </Button>


           <Button
      variant="contained"
      color="inherit"
      startIcon={<GoogleIcon />}
      onClick={googlelogin}
      sx={{ mt: 2 }}
    >
      Sign in with google
    </Button>
        </Container>
    )
}

export default RegisterForm