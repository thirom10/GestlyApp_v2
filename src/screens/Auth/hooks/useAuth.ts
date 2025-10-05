import { useState } from 'react';
import { AuthService, SignInData, SignUpData } from '../services/authService';
import { useAuthContext } from '../../../shared/context/AuthContext';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { signIn: contextSignIn, signUp: contextSignUp, signOut: contextSignOut } = useAuthContext();

  const signIn = async (data: SignInData) => {
    setLoading(true);
    try {
      await contextSignIn(data.email, data.password);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      await contextSignUp(data.email, data.password);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await contextSignOut();
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signIn,
    signUp,
    signOut,
  };
};