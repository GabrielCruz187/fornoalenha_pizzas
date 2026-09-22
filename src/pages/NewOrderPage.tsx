import { Printer } from 'lucide-react'
import { type ReactNode, useMemo, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { ProductPicker } from '../components/order/ProductPicker'
import { PizzaConfigModal } from '../components/order/PizzaConfigModal'
import { VariantConfigModal } from '../components/order/VariantConfigModal'
import { CartPanel } from '../components/order/CartPanel'
import { CustomerFields } from '../components/order/CustomerFields'
import { PaymentFields } from '../components/order/PaymentFields'
import { Button } from '../components/ui/Button'
import { buildFixedItem } from '../lib/cart'
import { parseMoney } from '../lib/parseMoney'
import { formatCurrency } from '../lib/format'
import { useOrdersStore } from '../store/useOrdersStore'
import { usePrintStore } from '../store/usePrintStore'
import { useToastStore } from '../store/useToastStore'
import type { DeliveryType, OrderItem, PaymentMethod, Product } from '../types'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <h2 className="mb-3 text-sm font-semibold text-cream">{title}</h2>
      {children}
    </div>
  )
}

export function NewOrderPage() {
  const createOrder = useOrdersStore((s) => s.createOrder)
  const requestPrint = usePrintStore((s) => s.requestPrint)
  const pushToast = useToastStore((s) => s.push)

  const [items, setItems] = useState<OrderItem[]>([])
  const [pizzaModalProduct, setPizzaModalProduct] = useState<Product | null>(null)
  const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('entrega')
  const [address, setAddress] = useState('')
  const [addressReference, setAddressReference] = useState('')
  const [deliveryFee, setDeliveryFee] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('dinheiro')
  const [changeFor, setChangeFor] = useState('')
  const [discount, setDiscount] = useState('')
  const [notes, setNotes] = useState('')

  const deliveryFeeValue = deliveryType === 'entrega' ? parseMoney(deliveryFee) : 0
  const discountValue = parseMoney(discount)
  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0)
  const total = Math.max(0, subtotal + deliveryFeeValue - discountValue)

  const canSubmit = useMemo(
    () => customerName.trim().length > 0 && items.length > 0 && (deliveryType === 'retirada' || address.trim().length > 0),
    [customerName, items.length, deliveryType, address],
  )

  const handleSelectProduct = (product: Product) => {
    if (product.pricingType === 'pizza') {
      setPizzaModalProduct(product)
    } else if (product.pricingType === 'variant') {
      setVariantModalProduct(product)
    } else {
      setItems((prev) => [...prev, buildFixedItem(product, 1)])
    }
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity, lineTotal: i.unitPrice * quantity } : i)),
    )
  }

  const resetForm = () => {
    setItems([])
    setCustomerName('')
    setCustomerPhone('')
    setDeliveryType('entrega')
    setAddress('')
    setAddressReference('')
    setDeliveryFee('')
    setPaymentMethod('dinheiro')
    setChangeFor('')
    setDiscount('')
    setNotes('')
  }

  const handleConfirm = () => {
    if (!canSubmit) {
      pushToast({
        variant: 'error',
        message: 'Complete os dados obrigatórios',
        description: 'Nome do cliente, endereço (se entrega) e ao menos 1 item.',
      })
      return
    }
    const order = createOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      deliveryType,
      address: deliveryType === 'entrega' ? address.trim() : undefined,
      addressReference: deliveryType === 'entrega' ? addressReference.trim() || undefined : undefined,
      items,
      paymentMethod,
      changeFor: paymentMethod === 'dinheiro' ? parseMoney(changeFor) || undefined : undefined,
      deliveryFee: deliveryFeeValue,
      discount: discountValue,
      notes: notes.trim() || undefined,
    })
    requestPrint(order)
    resetForm()
  }

  return (
    <div>
      <PageHeader title="Novo Pedido" subtitle="Lançamento rápido para a cozinha" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
        <div className="rounded-xl border border-border bg-surface p-4 lg:h-[74vh]">
          <ProductPicker onSelect={handleSelectProduct} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 overflow-y-auto lg:h-[58vh] lg:pr-1">
            <Section title={`Comanda${items.length ? ` · ${items.length} ${items.length === 1 ? 'item' : 'itens'}` : ''}`}>
              <CartPanel items={items} onUpdateQuantity={handleUpdateQuantity} onRemove={(id) => handleUpdateQuantity(id, 0)} />
            </Section>

            <Section title="Cliente e entrega">
              <CustomerFields
                customerName={customerName}
                onCustomerNameChange={setCustomerName}
                customerPhone={customerPhone}
                onCustomerPhoneChange={setCustomerPhone}
                deliveryType={deliveryType}
                onDeliveryTypeChange={setDeliveryType}
                address={address}
                onAddressChange={setAddress}
                addressReference={addressReference}
                onAddressReferenceChange={setAddressReference}
                deliveryFee={deliveryFee}
                onDeliveryFeeChange={setDeliveryFee}
              />
            </Section>

            <Section title="Pagamento">
              <PaymentFields
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                changeFor={changeFor}
                onChangeForChange={setChangeFor}
                discount={discount}
                onDiscountChange={setDiscount}
                notes={notes}
                onNotesChange={setNotes}
              />
            </Section>
          </div>

          <div className="rounded-xl border border-gold-700/40 bg-surface-raised p-4">
            <div className="flex flex-col gap-1 text-sm text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {deliveryFeeValue > 0 && (
                <div className="flex justify-between">
                  <span>Taxa de entrega</span>
                  <span>{formatCurrency(deliveryFeeValue)}</span>
                </div>
              )}
              {discountValue > 0 && (
                <div className="flex justify-between">
                  <span>Desconto</span>
                  <span>-{formatCurrency(discountValue)}</span>
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="font-display text-base font-semibold text-cream">Total</span>
              <span className="font-display text-xl font-bold text-gold-400">{formatCurrency(total)}</span>
            </div>
            <Button
              size="lg"
              className="mt-3 w-full"
              icon={<Printer size={17} />}
              disabled={!canSubmit}
              onClick={handleConfirm}
            >
              Confirmar e Imprimir
            </Button>
          </div>
        </div>
      </div>

      <PizzaConfigModal
        product={pizzaModalProduct}
        onClose={() => setPizzaModalProduct(null)}
        onConfirm={(item) => {
          setItems((prev) => [...prev, item])
          setPizzaModalProduct(null)
        }}
      />
      <VariantConfigModal
        product={variantModalProduct}
        onClose={() => setVariantModalProduct(null)}
        onConfirm={(item) => {
          setItems((prev) => [...prev, item])
          setVariantModalProduct(null)
        }}
      />
    </div>
  )
}
