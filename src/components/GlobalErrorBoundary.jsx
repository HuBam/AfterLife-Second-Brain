
import React from 'react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Global Error Caught:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReset = () => {
        localStorage.clear();
        window.location.href = '/';
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh',
                    width: '100vw',
                    backgroundColor: '#050508',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ color: '#ef4444', marginBottom: '10px' }}>SYSTEM CRITICAL FAILURE</h1>
                    <p style={{ color: '#aaa', marginBottom: '20px' }}>The application encountered an unrecoverable error.</p>

                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        padding: '20px',
                        borderRadius: '8px',
                        border: '1px solid #333',
                        maxWidth: '800px',
                        overflow: 'auto',
                        marginBottom: '30px',
                        textAlign: 'left'
                    }}>
                        <p style={{ color: '#f87171', marginBottom: '10px' }}>{this.state.error?.toString()}</p>
                        <pre style={{ fontSize: '0.8rem', color: '#888' }}>
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </div>

                    <button
                        onClick={this.handleReset}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)'
                        }}
                    >
                        HARD RESET SYSTEM (CLEAR DATA)
                    </button>
                    <p style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                        Warning: This will delete all local user data and reset the app.
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
