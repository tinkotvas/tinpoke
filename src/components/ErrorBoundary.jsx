import { Component } from 'react';
import { Typography, Flex, Button, theme } from 'antd';

const { Title, Text } = Typography;

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Flex
          vertical
          align="center"
          justify="center"
          style={{ minHeight: '100vh', padding: 24 }}
        >
          <Title level={3}>Something went wrong</Title>
          <Text type="secondary" style={{ textAlign: 'center', marginBottom: 24 }}>
            The app encountered an unexpected error. This is a local file with no server logging,
            so please check the browser console for details.
          </Text>
          <Button type="primary" onClick={this.handleReset}>
            Reload App
          </Button>
        </Flex>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;