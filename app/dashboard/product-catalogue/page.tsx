import { Upload } from 'lucide-react'
import { getProducts } from './actions'
import { ProductCard } from './_components/product-card'
import { ProductCatalogueClient } from './_components/product-catalogue-client'

export default async function ProductCataloguePage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string; category?: string; insurer?: string }>
}) {
    const params = await searchParams
    const { query, category, insurer } = params

    const { products, totalCount } = await getProducts({
        query,
        category: category !== 'All' ? category : undefined,
        status: 'Active'
    })

    // Filter by insurer on the client side if needed
    const filteredProducts = insurer && insurer !== 'All'
        ? products.filter(p => p.insurer === insurer)
        : products

    return (
        <ProductCatalogueClient
            products={filteredProducts}
            totalCount={totalCount}
            initialQuery={query || ''}
            initialCategory={category || 'All'}
            initialInsurer={insurer || 'All'}
        />
    )
}
