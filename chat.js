const { useState, useEffect } = React;

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  // Initialize Socket.IO with JWT token
  const socket = io('http://localhost:3000', {
    auth: { token: localStorage.getItem('token') }
  });

  useEffect(() => {
    // Handle incoming messages
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });
    // Handle connection errors
    socket.on('connect_error', (err) => {
      setError('Connection failed. Please log in again.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    });
    return () => {
      socket.off('message');
      socket.off('connect_error');
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) {
      setError('Message cannot be empty');
      return;
    }
    socket.emit('message', { username: localStorage.getItem('username'), text: input });
    setInput('');
    setError('');
  };

  return (
    <div className="chat-container p-8 rounded-2xl shadow-aero font-aero">
      <h1 className="text-3xl font-bold text-center mb-6 text-aero-light">CondoUnderground Chat</h1>
      {error && (
        <div className="bg-red-500 text-white p-2 rounded-lg mb-4 text-center font-aero">
          {error}
        </div>
      )}
      <div className="message-area">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 text-aero-light">
            <span className="font-bold text-aero-glow">{msg.username}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="w-full p-2 bg-aero-dark bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-aero-glow text-aero-light font-aero"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="w-full mt-2 py-2 bg-aero-green hover:bg-aero-glow rounded-lg transition-all duration-200 transform hover:scale-105 shadow-aero font-aero"
        >
          Send
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<ChatPage />, document.getElementById('root'));
