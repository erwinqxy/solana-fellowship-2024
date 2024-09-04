import { useRef } from 'react'
import { products } from '../lib/products'
import NumberInput from './NumberInput'

interface Product {
  id: string
  name: string
  description: string
  priceUsd: number
  unitName?: string
  imageUrl?: string // Added an optional imageUrl property
}

interface Props {
  submitTarget: string
  enabled: boolean
}

export default function Products({ submitTarget, enabled }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form method="get" action={submitTarget} ref={formRef}>
      <div className="flex flex-col gap-16">
        <div
          className="grid   grid-cols-3 gap-4"
        >
          {products.map((product) => (
            <div className="rounded-md bg-white p-8 text-left" key={product.id}>
              {product.imageUrl && ( // Check if imageUrl exists before rendering
                <img
                  src={product.imageUrl}
                  alt={`${product.name} product`}
                  className="mb-4 h-48 w-full object-cover"
                />
              )}
              <h3 className="text-2xl font-bold">{product.name}</h3>
              <p className="text-sm text-gray-800">{product.description}</p>
              <p className="my-4">
                <span className="mt-4 text-xl font-bold">
                  ${product.priceUsd}
                </span>
                {product.unitName && (
                  <span className="text-sm text-gray-800">
                    {' '}
                    /{product.unitName}
                  </span>
                )}
              </p>
              <div className="mt-1">
                <NumberInput name={product.id} formRef={formRef} />
              </div>
            </div>
          ))}
        </div>

        <button
          className="max-w-fit items-center self-center rounded-md bg-gray-900 px-20 py-2 text-white hover:scale-105   
 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!enabled}
        >
          Checkout  
          <img src="/white-gradient.svg" />
        </button>
      </div>
    </form>
  )
}
