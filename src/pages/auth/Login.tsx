import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../store/slices/authSlice';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
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

    // send data
    dispatch(loginUser({ username, password }))
      .unwrap()
      .then((payload) => {
        if (payload.token) {
          navigate('/');
        }
      })
      .catch((err) => {
        console.log('Đăng nhập thất bại: ', err);
      });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-wms-dark text-white p-5 md:p-10 font-sans"
      style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.02) 0px,
          rgba(255, 255, 255, 0.02) 100px,
          transparent 100px,
          transparent 200px
        )`,
      }}
    >
      <div className="w-full max-w-275 flex flex-col md:flex-row flex-wrap gap-12 md:gap-12.5">
        {/* --- LEFT PANEL --- */}
        <div className="flex-1 min-w-75 flex flex-col justify-center py-5 md:p-5">
          <div className="text-[22px] font-bold tracking-[2px] mb-10">
            Warehouse Management System
          </div>
          <h1 className="text-[40px] md:text-[56px] font-bold mb-3.75 tracking-[1px]">Welcome!</h1>
          <div className="w-15 h-0.5 bg-white mb-6.25"></div>
          <p className="text-wms-muted leading-[1.6] text-[14px] mb-10 max-w-100">
            A comprehensive solution for warehouse operations. Optimize space, accelerate order
            processing, and minimize errors.
          </p>
          <button className="bg-wms-primary hover:bg-wms-primary-hover text-white border-none py-3 px-7.5 rounded-full text-[15px] font-medium cursor-pointer w-fit transition-colors duration-300">
            Learn More
          </button>
        </div>

        {/* --- RIGHT PANEL (LOGIN CARD) --- */}
        <div className="flex-1 min-w-75 md:min-w-87.5 flex justify-center items-center">
          <div className="bg-wms-card backdrop-blur-md p-10 md:p-[50px_40px] rounded-[10px] w-full max-w-112.5 shadow-[0_15px_35px_rgba(0,0,0,0.2)]">
            <h2 className="text-center text-[28px] mb-10 font-semibold">Sign In</h2>

            {(validationError || error) && (
              <div className="p-3 mb-6 text-sm text-red-200 bg-red-900/50 border border-red-500/50 rounded-lg text-center">
                {validationError || error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-6.25">
                <label className="block mb-2.5 text-[14px] font-medium">User Name</label>
                <input
                  type="text"
                  placeholder="Frieren"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full p-[15px_20px] pr-12 rounded-full border-none bg-wms-input text-white text-[14px] outline-none transition-shadow duration-300 focus:shadow-[0_0_0_2px_#3b82f6] placeholder:text-wms-muted"
                />
              </div>

              <div className="mb-6.25">
                <label className="block mb-2.5 text-[14px] font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-[15px_20px] rounded-full border-none bg-wms-input text-white text-[14px] outline-none transition-shadow duration-300 focus:shadow-[0_0_0_2px_#3b82f6] placeholder:text-wms-muted [&::-ms-reveal]:hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none cursor-pointer"
                  >
                    {!showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                        <line x1="2" y1="2" x2="22" y2="22"></line>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full p-3.75 rounded-full border-none bg-wms-primary hover:bg-wms-primary-hover text-white text-[16px] font-semibold mt-15 mb-6.25 cursor-pointer transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    {/* Icon SVG Spinner of Tailwind */}
                    <svg
                      className="w-5 h-5 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
