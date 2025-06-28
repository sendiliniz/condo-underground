const { useState } = React;

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('Submitting registration:', { username, email, password });

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }
    if (!/^\w{3,20}$/.test(username)) {
      setError('Username must be 3-20 characters, letters, numbers, or underscores');
      setIsLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      setIsLoading(false);
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const responseData = await response.json();
      console.log('Server response:', responseData);
      if (response.ok) {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('username', responseData.username);
        window.location.href = '/chat'; // Redirect to chat page
      } else {
        setError(responseData.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err.message);
      setError('Failed to connect to the server. Check your network or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-aero-dark bg-opacity-80 backdrop-blur-md rounded-2xl shadow-aero text-center max-w-md">
      <h1 className="text-4xl font-bold mb-4 font-aero text-gradient">CondoUnderground - Chat App</h1>
      <h2 className="text-xl font-semibold mb-4 font-aero text-aero-glow">Register</h2>
      {error && (
        <div className="bg-red-500 text-white p-2 rounded-lg mb-4 text-center font-aero">
          {error}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username" className="block text-sm font-medium font-aero text-aero-light">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-aero-dark border-2 border-aero-light/20 rounded-lg text-aero-light focus:outline-none input-glow"
            placeholder="Enter username (3-20 chars)"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium font-aero text-aero-light">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-aero-dark border-2 border-aero-light/20 rounded-lg text-aero-light focus:outline-none input-glow"
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium font-aero text-aero-light">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-aero-dark border-2 border-aero-light/20 rounded-lg text-aero-light focus:outline-none input-glow"
            placeholder="Enter password (min 8 chars)"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium font-aero text-aero-light">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 bg-aero-dark border-2 border-aero-light/20 rounded-lg text-aero-light focus:outline-none input-glow"
            placeholder="Confirm password"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-aero-blue to-aero-green hover:from-aero-glow hover:to-aero-purple rounded-lg transition-all duration-200 hover-glow font-aero text-aero-light text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-aero-light">
        Already have an account?{' '}
        <a href="/login" className="text-aero-glow hover:text-aero-purple hover:underline">
          Login
        </a>
      </p>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2 font-aero text-aero-glow">Discover Condo Listings</h2>
        <p className="text-aero-light mb-4">Our backend scraper fetches real-time condo data from condos.ca. Check out the source!</p>
        <a
          href="https://github.com/sendiliniz/condo-underground"
          className="inline-block py-2 px-4 bg-aero-dark border-2 border-aero-glow hover:bg-aero-glow hover:text-aero-dark rounded-lg transition-all duration-200 hover-glow font-aero"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Source on GitHub
        </a>
      </div>
    </div>
  );
}

// No ReactDOM.render here, as this is for external inclusion
