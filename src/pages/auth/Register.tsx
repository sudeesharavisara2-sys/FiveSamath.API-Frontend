// src/pages/auth/Register.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import AuthLayout from "./AuthLayout";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";

const API_URL = 'http://localhost:5153/api';

export default function Register() {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate password strength
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting registration with:', { 
        name, 
        email, 
        passwordLength: password.length 
      });

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          password: password 
        }),
      });

      // Get the response text first
      const responseText = await response.text();
      console.log('Response status:', response.status);
      console.log('Response body:', responseText);

      if (!response.ok) {
        // Try to parse error as JSON, fallback to text
        let errorMessage = responseText;
        try {
          const errorJson = JSON.parse(responseText);
          errorMessage = errorJson.message || errorJson.title || errorJson || responseText;
        } catch {
          // If not JSON, use the text as is
          errorMessage = responseText || 'Registration failed';
        }
        throw new Error(errorMessage);
      }

      // Parse the response if it's JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      toast.success("OTP sent to your email!");
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error('Registration error:', err);
      toast.error(err.message || t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t.auth.register}>
      <form onSubmit={handleSubmit}>
        <TextField 
          label={t.auth.name} 
          required 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
        <TextField
          label={t.auth.email}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label={t.auth.password}
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Password must be at least 6 characters
        </p>
        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          {t.auth.register}
        </Button>
      </form>
      <p className="text-center text-sm text-ink/50 font-medium mt-5">
        {t.auth.haveAccount}{" "}
        <Link to="/login" className="text-sky-dark font-bold">
          {t.auth.login}
        </Link>
      </p>
    </AuthLayout>
  );
}