"use client"
import React from 'react';
import { Box, Button, Container, Input } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {signIn} from 'next-auth/react';
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google'


function LoginForm() {
const githublogin=async()=>{
  signIn('github');
};

const googleLogin=async()=>{
signIn("google");
};

const router = useRouter();
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
router.push("/pages/component/chatcontainer")

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
      onClick={googleLogin}
      sx={{ mt: 2 }}
    >
      Sign in with google
    </Button>

    </Container>
  );
}

export default LoginForm;
