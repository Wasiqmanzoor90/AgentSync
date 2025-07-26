"use client"
import React from 'react';
import { Box, Button, Container, Input } from '@mui/material';
import Link from 'next/link';


function LoginForm() {

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.token || data.existuser) {

       document.cookie = `token=${data.token}; path=/; max-age=86400`; // valid for 1 day
        localStorage.setItem("email", data.existuser.email)
        localStorage.setItem("id", data.existuser.id)

        console.log('Login success:', data);

        // ✅ Redirect to chat page

      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleLogin} display="flex" flexDirection="column" gap={2}>
        <Input name="email" placeholder="Enter email" />
        <Input name="password" placeholder="Enter password" type="password" />
        <Button type="submit" variant="contained">Login</Button>
      </Box>
      <Link href="/pages/auth/register">
        <Button>ok</Button>
      </Link>
      <Link href="/pages/component/chatcontainer">
        <button>Go to Chat</button>
      </Link>

    </Container>
  );
}

export default LoginForm;
