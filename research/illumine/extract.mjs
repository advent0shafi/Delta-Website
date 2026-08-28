import fs from 'node:fs'
import path from 'node:path'

const dir = 'raw'
const files = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(dir).filter(f => f.endsWith('.html'))

const decode = s => s
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;|&lsquo;/g, "'")
  .replace(/&quot;|&ldquo;|&rdquo;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&hellip;/g, '…')
  .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))

const strip = s => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

for (const f of files) {
  const html = fs.readFileSync(path.join(dir, f), 'utf8')
  const out = []
  out.push(`# FILE: ${f}`)

  const meta = (re) => (html.match(re) || [, ''])[1]
  out.push(`TITLE: ${decode(meta(/<title>([\s\S]*?)<\/title>/i) || '')}`)
  out.push(`DESC: ${decode(meta(/<meta name="description" content="([^"]*)"/i) || '')}`)
  out.push('')

  // body only
  const body = (html.match(/<body[\s\S]*?>([\s\S]*)<\/body>/i) || [, html])[1]

  // walk sections
  const sectionRe = /<section\b([^>]*)>/gi
  let m, idx = 0
  const marks = []
  while ((m = sectionRe.exec(body))) marks.push({ i: m.index, attrs: m[1] })
  marks.push({ i: body.length, attrs: '' })

  for (let k = 0; k < marks.length - 1; k++) {
    const chunk = body.slice(marks[k].i, marks[k + 1].i)
    const attrs = marks[k].attrs
    const grp = (attrs.match(/group="([^"]*)"/) || [, ''])[1]
    const cls = (attrs.match(/class="([^"]*)"/) || [, ''])[1]
    const id = (attrs.match(/id="([^"]*)"/) || [, ''])[1]
    out.push(`\n--- SECTION ${++idx}  id=${id}  group="${grp}"  class="${cls}" ---`)

    // background image / video
    const bgimg = [...chunk.matchAll(/background-image:\s*url\(([^)]+)\)/gi)].map(x => x[1])
    if (bgimg.length) out.push(`  BG: ${bgimg.join(', ')}`)
    const vid = [...chunk.matchAll(/<(?:video|iframe)[^>]*src="([^"]+)"/gi)].map(x => x[1])
    if (vid.length) out.push(`  MEDIA: ${vid.join(', ')}`)

    // headings + paragraphs + list items + buttons, in document order
    const nodeRe = /<(h[1-6]|p|li|a|img)\b([^>]*)>([\s\S]*?)<\/\1>|<img\b([^>]*)\/?>/gi
    let n
    while ((n = nodeRe.exec(chunk))) {
      const tag = (n[1] || 'img').toLowerCase()
      if (tag === 'img') {
        const a = n[2] || n[4] || ''
        const src = (a.match(/src="([^"]*)"/) || [, ''])[1]
        const alt = (a.match(/alt="([^"]*)"/) || [, ''])[1]
        if (src) out.push(`  [IMG] ${src}${alt ? `  alt="${decode(alt)}"` : ''}`)
        continue
      }
      const inner = strip(n[3] || '')
      if (!inner) continue
      const a = n[2] || ''
      const acls = (a.match(/class="([^"]*)"/) || [, ''])[1]
      if (tag === 'a') {
        if (!/btn/.test(acls)) continue
        const href = (a.match(/href="([^"]*)"/) || [, ''])[1]
        out.push(`  [BTN] "${inner}" -> ${href}`)
      } else if (/^h[1-6]$/.test(tag)) {
        out.push(`  <${tag.toUpperCase()}> ${inner}`)
      } else {
        out.push(`  ${tag === 'li' ? '• ' : ''}${inner}`)
      }
    }
  }
  fs.writeFileSync(path.join('text', f.replace(/\.html$/, '.txt')), out.join('\n'))
}
console.log('extracted', files.length)
