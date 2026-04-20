import { Component, type PropsWithChildren, type ReactNode } from 'react';

interface Props extends PropsWithChildren {
  fallback: (props: { error: Error; reset: () => void }) => ReactNode;
  onReset?: () => void;
  resetKeys?: unknown[];
}

interface State {
  error: Error | null;
  prevResetKeys: unknown[];
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, prevResetKeys: this.props.resetKeys ?? [] };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  static getDerivedStateFromProps(
    props: Props,
    state: State,
  ): Partial<State> | null {
    const currentKeys = props.resetKeys ?? [];
    const changed = currentKeys.some(
      (key, i) => key !== state.prevResetKeys[i],
    );

    if (!changed) {
      return null;
    }

    if (state.error !== null) {
      return { error: null, prevResetKeys: currentKeys };
    }

    return { prevResetKeys: currentKeys };
  }

  reset = () => {
    this.props.onReset?.();
    this.setState({ error: null, prevResetKeys: this.props.resetKeys ?? [] });
  };

  render() {
    if (this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        reset: this.reset,
      });
    }
    return this.props.children;
  }
}
