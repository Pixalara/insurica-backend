
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qlaslhiuacihctyhfzuk.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_RoS64nlrNzuJdiVEd2BU0w_lCCLpbwe' // Extracted from .env.local

console.log('Parameters:', { SUPABASE_URL, SUPABASE_ANON_KEY })

async function checkPdfs() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

  console.log('Fetching products...')
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, pdf_url')

  if (error) {
    console.error('Error fetching products:', error)
    return
  }

  console.log(`Found ${products.length} products.`)

  for (const product of products) {
    if (!product.pdf_url) {
      console.log(`[ ] ${product.name}: No PDF URL`)
      continue
    }

    try {
      const response = await fetch(product.pdf_url, { method: 'HEAD' })
      if (response.ok) {
        console.log(`[OK] ${product.name}: PDF accessible (${product.pdf_url})`)
      } else {
        console.error(`[FAIL] ${product.name}: PDF URL returned ${response.status} (${product.pdf_url})`)
      }
    } catch (err) {
      console.error(`[ERR] ${product.name}: Failed to fetch PDF (${err.message})`)
    }
  }
}

checkPdfs()
