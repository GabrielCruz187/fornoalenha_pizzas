import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '../ui/Button'

interface Props {
  children: ReactNode
  routeKey: string
}

interface State {
  error: Error | null
}

export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.routeKey !== this.props.routeKey && this.state.error) {
      this.setState({ error: null })
    }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('Route render error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-status-error/30 bg-status-error-bg px-6 py-16 text-center">
          <AlertTriangle className="text-status-error" size={28} />
          <h2 className="font-display text-base font-semibold text-cream">Algo deu errado nesta página</h2>
          <p className="max-w-sm text-sm text-muted">
            {this.state.error.message || 'Erro inesperado ao carregar o conteúdo.'}
          </p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Recarregar
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
