import { useState, useEffect } from 'react';

const GoogleSignIn = ({ onSuccess, onError, disabled = false }) => {
  const [loading, setLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    // Load Google Identity Services script
    const loadGoogleScript = () => {
      if (window.google) {
        setGoogleLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleLoaded(true);
        console.log('✅ Google Identity Services loaded');
      };
      script.onerror = () => {
        console.error('❌ Failed to load Google Identity Services');
        onError('Failed to load Google sign-in');
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  const handleGoogleSignIn = async () => {
    if (!googleLoaded || !window.google) {
      onError('Google sign-in not available');
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔍 Initializing Google Sign-In...');
      
      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            console.log('📨 Received Google credential, sending to backend...');
            
            // Send credential to backend
            const result = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                credential: response.credential
              })
            });

            const data = await result.json();
            console.log('📥 Backend response:', data);

            if (result.ok) {
              // Store token and trigger success
              localStorage.setItem('token', data.token);
              console.log('✅ Google sign-in successful');
              onSuccess(data);
            } else {
              console.error('❌ Backend error:', data.error);
              onError(data.error || 'Google sign-in failed');
            }
          } catch (error) {
            console.error('❌ Google Sign-In error:', error);
            onError('Network error during Google sign-in');
          } finally {
            setLoading(false);
          }
        }
      });

      // Prompt for sign-in
      window.google.accounts.id.prompt();
      
    } catch (error) {
      console.error('❌ Google Sign-In initialization error:', error);
      onError('Failed to initialize Google sign-in');
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg font-medium hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="hidden sm:inline">Signing in...</span>
          <span className="sm:hidden">Signing in...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="hidden sm:inline">Continue with Google</span>
          <span className="sm:hidden">Google</span>
        </>
      )}
    </button>
  );
};

export default GoogleSignIn;
