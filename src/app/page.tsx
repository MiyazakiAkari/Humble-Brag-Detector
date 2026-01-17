import Analyzer from "./components/Analyzer";

export default function Home() {
  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '4rem 1rem',
    }}>
      <h1 style={{
        fontSize: '3.5rem',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        background: 'linear-gradient(to right, #00f3ff, #00ff88)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
        filter: 'drop-shadow(0 0 20px rgba(0, 243, 255, 0.3))'
      }}>
        Humble Brag Detector
      </h1>
      <p style={{
        color: '#888',
        marginBottom: '4rem',
        fontSize: '1.2rem',
        textAlign: 'center'
      }}>
        自虐風自慢検知システム
      </p>

      <Analyzer />
    </main>
  );
}
