import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { PrintPortal } from './components/receipt/PrintPortal'
import { ToastViewport } from './components/ui/ToastViewport'
import { NewOrderPage } from './pages/NewOrderPage'
import { OrdersHistoryPage } from './pages/OrdersHistoryPage'
import { MenuPage } from './pages/MenuPage'
import { DashboardPage } from './pages/DashboardPage'
import { CashClosingPage } from './pages/CashClosingPage'

function App() {
  return (
    <>
      <PrintPortal />
      <HashRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<NewOrderPage />} />
            <Route path="pedidos" element={<OrdersHistoryPage />} />
            <Route path="cardapio" element={<MenuPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="caixa" element={<CashClosingPage />} />
          </Route>
        </Routes>
      </HashRouter>
      <ToastViewport />
    </>
  )
}

export default App
