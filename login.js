const { useState } = React;

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // Store JWT token
        localStorage.setItem('username', data.username); // Store username for chat
        window.location.href = '/chat';
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container p-8 rounded-2xl shadow-aero">
      <h1 className="text-3xl font-bold text-center mb-6 font-aero text-aero-light">CondoUnderground</h1>
      <h2 className="text-xl font-semibold text-center mb-4 font-aero text-aero-light">Login</h2>
      {error && (
        <div className="bg-red-500 text-white p-2 rounded-lg mb-4 text-center font-aero">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium font-aero text-aero-light">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 bg-aero-dark bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-aero-glow text-aero-light font-aero"
            placeholder="Enter your email"
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
            className="w-full p-2 mt-1 bg-aero-dark bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-aero-glow text-aero-light font-aero"
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-aero-blue hover:bg-aero-glow rounded-lg transition-all duration-200 transform hover:scale-105 shadow-aero font-aero"
        >
          Login
        </button>
        <p className="text-center text-sm font-aero text-aero-light">
          Don't have an account?{' '}
          <a href="/register" className="text-aero-glow hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

ReactDOM.render(<LoginPage />, document.getElementById('root'));
