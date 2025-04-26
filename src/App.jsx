import Dashboard from './Dashboard';

function App() {
  return (
    <div style={{ backgroundColor: '#0d1117', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
        📈 AI股市分析看板
      </h1>
      <Dashboard />
    </div>
  );
}

export default App;
