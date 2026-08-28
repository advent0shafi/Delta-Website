import fs from 'node:fs'
const slugs = [...new Set(fs.readFileSync('sitemap-urls.txt','utf8').trim().split('\n')
  .map(u => u.replace(/^https?:\/\/(www\.)?illumineenergy\.com\//,'') || 'index.html'))]

const CORE = ['index.html','about.html','services.html','projects.html','blog.html','career.html','contact-us.html','enquiry.html','bipv.html','jyothirgamaya-csr-programme.html']
const PRODUCT = ['ongrid-solar-system-in-kerala.html','offgrid-solar-system-in-kerala.html','hybrid-solar-project.html','subsidy.html','micro-inverters.html']
const LEGAL = ['privacy-policy.html','terms-and-conditions.html','cancellation-and-refund-policy.html','shipping-and-delivery-policy.html']
const SEO_LP = ['best-solar-company-in-kerala.html','hybrid-solar-panel-system-kerala.html','micro-inverter-installation.html','solar-panel-price-in-kerala.html','solar-panel-price-in-kochi.html','solar-panel-dealer-in-ernakulam.html']

const bucket = s => CORE.includes(s) ? 'core' : PRODUCT.includes(s) ? 'product' : LEGAL.includes(s) ? 'legal' : SEO_LP.includes(s) ? 'seo-landing' : 'article'
const groups = {}
for (const s of slugs) (groups[bucket(s)] ??= []).push(s)
for (const [k,v] of Object.entries(groups)) console.log(`${k.padEnd(12)} ${String(v.length).padStart(3)}`)
console.log('TOTAL       ', slugs.length)
fs.writeFileSync('pages.json', JSON.stringify(groups, null, 2))
console.log('\nARTICLES:'); groups.article.forEach(a => console.log(' -', a))
