import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser } from './authThunks';

export const useLogin = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // check if the username and password are valid
    if (username.trim() === '') {
      setValidationError('Vui lòng nhập tên đăng nhập.');
      return;
    }

    if (username.includes(' ')) {
      setValidationError('Tên đăng nhập không được chứa khoảng trắng.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setValidationError('');

    try {
      // send data
      const response = await dispatch(loginUser({ username, password })).unwrap();

      // redirect based on role
      if (response.data.role === 'ADMIN' || response.data.role === 'MANAGER') {
        navigate('/');
      } else {
        navigate('/mobile');
      }
    } catch (err) {
      console.error('Login failed:', err);
      // Bạn có thể xử lý thêm lỗi API tại đây nếu cần thiết
    }
  };

  return {
    state: {
      username,
      password,
      showPassword,
      validationError,
      loading,
      error,
    },
    actions: {
      setUsername,
      setPassword,
      setShowPassword,
      handleLogin,
    },
  };
};
