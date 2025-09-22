#!/usr/bin/env node
// scripts/compare-docx-md.js
// Usage: node scripts/compare-docx-md.js --docx "path/to/file.docx" --md "path/to/file.md" [--tolerant]

const fs = require('fs')
const path = require('path')
const mammoth = require('mammoth')
const { spawnSync } = require('child_process')
const Diff = require('diff')

function usage() {
  console.log('Usage: node scripts/compare-docx-md.js --docx "path/to/file.docx" --md "path/to/file.md" [--tolerant]')
  process.exit(1)
}

const argv = require('minimist')(process.argv.slice(2))
if (!argv.docx || !argv.md) usage()

const docxPath = path.resolve(argv.docx)
const mdPath = path.resolve(argv.md)
const outDirArg = argv.outDir || argv.outdir
const tolerant = !!argv.tolerant
const paragraphMode = !!argv.paragraph
const ignoreMarkdown = !!argv['ignore-markdown']
const sectionMode = !!argv.section
const htmlOutput = !!argv.html

async function extractDocx(file) {
  const buffer = fs.readFileSync(file)
  const res = await mammoth.extractRawText({buffer})
  return res.value
}

async function extractDocxHtmlParagraphs(file) {
  const buffer = fs.readFileSync(file)
  const res = await mammoth.convertToHtml({buffer})
  const html = res.value
  // extract <h1..h6>, <p>, and <ul> blocks in document order and capture <li> items
  const re = /<(h[1-6]|p|ul)[^>]*>([\s\S]*?)<\/\1>/gi
  const elements = []
  let match
  while ((match = re.exec(html))) {
    const tag = match[1].toLowerCase()
    const rawInner = match[2]
    if (tag === 'ul') {
      // capture li items and push as separate p entries (preserve order)
      const items = [...rawInner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m=>m[1].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim()).filter(Boolean)
      for (const it of items) elements.push({ type: 'p', text: '- ' + it })
      continue
    }
  // decode HTML entities and strip tags
  const stripped = rawInner.replace(/<[^>]+>/g, '')
  const innerText = decodeHtmlEntities(stripped).replace(/\s+/g, ' ').trim()
    // detect headings encoded as <p><strong>...</strong></p> or <p><b>..</b></p>
    const isStrongHeading = /^\s*<(strong|b)\b/i.test(rawInner) || /<strong[\s\S]*?>[\s\S]*?<\/strong>/i.test(rawInner)
    if (tag.startsWith('h') || isStrongHeading) {
      elements.push({ type: 'heading', text: innerText })
    } else {
      elements.push({ type: 'p', text: innerText })
    }
  }
  // build paragraphs by grouping p's under last heading or Intro
  const result = []
  let current = { title: 'Intro', body: [] }
  for (const s of elements) {
    if (s.type === 'heading') {
      // push current section even if empty (keeps headings with empty bodies)
      result.push({ title: current.title, body: current.body.join(' ') })
      current = { title: s.text || 'Untitled', body: [] }
    } else {
      current.body.push(s.text)
    }
  }
  // push last
  result.push({ title: current.title, body: current.body.join(' ') })
  // fallback: if empty, return entire text as single paragraph
  if (!result.length) {
    const raw = (await mammoth.extractRawText({buffer})).value.replace(/\s+/g, ' ').trim()
    return [{ title: 'Intro', body: raw }]
  }
  // filter out completely empty sections
  return result.map(r=>({ title: r.title, body: r.body.trim() })).filter(r=>r.body.length || r.title!=='Intro')
}

function splitDocxByMdHeadings(docxText, mdSections) {
  const normalizeForMatch = s => {
    if (!s) return ''
    // decode html entities first
    const dec = decodeHtmlEntities(s)
    return dec.toLowerCase().replace(/[\p{P}\p{S}]/gu, ' ').replace(/\s+/g, ' ').trim()
  }
  const docNorm = normalizeForMatch(docxText)
  const positions = []
  for (const s of mdSections) {
    const title = normalizeForMatch(s.title)
    if (!title) continue
    // build a word boundary regex to match title approx
    const regex = new RegExp('\\b' + title.replace(/\s+/g, '\\s+') + '\\b', 'i')
    const m = regex.exec(docNorm)
    const idx = m ? m.index : -1
    positions.push({ title: s.title, idx })
  }
  const found = positions.filter(p => p.idx >= 0).sort((a,b)=>a.idx-b.idx)
  if (!found.length) return null
  const sections = []
  for (let i=0;i<found.length;i++) {
    const start = found[i].idx
    const end = i+1<found.length ? found[i+1].idx : docNorm.length
    const body = docNorm.substring(start,end).replace(/\s+/g,' ').trim()
    sections.push({ title: found[i].title, body })
  }
  // intro before first found
  const firstIdx = found[0].idx
  if (firstIdx>0) {
    const intro = docNorm.substring(0, firstIdx).replace(/\s+/g,' ').trim()
    if (intro) sections.unshift({ title:'Intro', body:intro })
  }
  return sections
}

function decodeHtmlEntities(str) {
  if (!str || typeof str !== 'string') return ''
  // simple replacements first for common named entities
  const named = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'" }
  let out = str.replace(/&[a-z]+;/gi, m => (named[m.toLowerCase()] || m))
  // decode numeric entities
  out = out.replace(/&#(x?[0-9a-fA-F]+);/g, (m, code) => {
    const num = code.toLowerCase().startsWith('x') ? parseInt(code.substring(1), 16) : parseInt(code, 10)
    if (!isNaN(num)) return String.fromCodePoint(num)
    return m
  })
  return out
}

function readMd(file) {
  let txt = fs.readFileSync(file, 'utf8')
  // strip YAML frontmatter
  if (txt.startsWith('---')) {
    const parts = txt.split('---')
    if (parts.length > 2) txt = parts.slice(2).join('---')
  }
  return txt
}

function normalize(s) {
  // normalize whitespace and some punctuation differences
  let out = s.replace(/\r\n?/g, '\n')
  out = out.replace(/\n{2,}/g, '\n\n')
  out = out.replace(/[ \t]+$/gm, '')
  if (tolerant) {
    out = out.replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    out = out.replace(/–/g, '-').replace(/—/g, ' - ')
    out = out.replace(/\u00A0/g, ' ')
    out = out.replace(/\s+\n/g, '\n')
  }
  return out.trim()
}

function stripMarkdownFormatting(md) {
  let s = md
  // remove code blocks
  s = s.replace(/```[\s\S]*?```/g, '')
  // remove inline code
  s = s.replace(/`[^`]*`/g, '')
  // remove images ![alt](url)
  s = s.replace(/!\[[^\]]*\]\([^\)]*\)/g, '')
  // remove links but keep text [text](url) -> text
  s = s.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  // remove emphasis *text* or _text_
  s = s.replace(/\*([^*]+)\*/g, '$1')
  s = s.replace(/_([^_]+)_/g, '$1')
  // remove HTML tags
  s = s.replace(/<[^>]+>/g, '')
  // remove shortcodes like ::anchored{...} and :::
  s = s.replace(/::[^{\n]+\{[^}]*\}/g, '')
  s = s.replace(/:::/g, '')
  return s
}

function splitParagraphs(s) {
  // split on double newlines and trim
  return s.split(/\n{2,}/).map(p => p.replace(/\n+/g, ' ').trim()).filter(Boolean)
}

function splitSections(s) {
  // split on headings (## or lines that look like headings)
  const lines = s.split('\n')
  const sections = []
  let current = { title: 'Intro', body: [] }
  for (let line of lines) {
    const m = line.match(/^#{1,6}\s*(.*)/)
    if (m) {
      // push current
      if (current.body.length || current.title) sections.push(current)
      current = { title: m[1].trim(), body: [] }
    } else {
      current.body.push(line)
    }
  }
  if (current.body.length || current.title) sections.push(current)
  // normalize section bodies
  return sections.map(sec => ({ title: sec.title || 'Intro', body: sec.body.join('\n').replace(/\n+/g, ' ').trim() }))
}

function makeSideBySideHtml(sectionsA, sectionsB, leftLabel, rightLabel) {
  // build an HTML page with each section side-by-side and inline diffs
  const rows = []
  const mapA = new Map(sectionsA.map(s => [s.title.toLowerCase(), s]))
  // iterate in the order of sectionsB (markdown) so the markdown order is preserved
  for (const sb of sectionsB) {
    const key = sb.title.toLowerCase()
    const sa = mapA.get(key) || { title: sb.title, body: '' }
    const inline = Diff.diffWordsWithSpace(sa.body, sb.body)
    const left = inline.map(part => part.added ? '' : part.removed ? `<del style="background:#fdd">${escapeHtml(part.value)}</del>` : escapeHtml(part.value)).join('')
    const right = inline.map(part => part.removed ? '' : part.added ? `<ins style="background:#dfd">${escapeHtml(part.value)}</ins>` : escapeHtml(part.value)).join('')
    rows.push({ title: sb.title, left, right })
    mapA.delete(key)
  }
  // append any DOCX-only sections that were not matched to markdown
  for (const sa of mapA.values()) {
    rows.push({ title: sa.title, left: escapeHtml(sa.body), right: '' })
  }

  const html = []
  html.push('<!doctype html><html><head><meta charset="utf-8"><title>Comparison report</title>')
  html.push('<style>body{font-family: Arial, Helvetica, sans-serif; padding:20px} .file-headers{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:0} .file-headers .col{padding:8px;border:1px solid #eee;background:#fafafa;font-weight:700;text-align:left} .row{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px} .col{padding:10px;border:1px solid #eee;background:#fff;word-break:break-word} h2{margin:0 0 10px 0;font-size:18px} del{color:#900;text-decoration:none} ins{color:#060;text-decoration:none}</style>')
  html.push('</head><body>')
  html.push(`<h1>Comparison report - ${new Date().toISOString()}</h1>`)
  // add file name headers aligned with columns (use same .row/.col grid)
  html.push('<div class="row file-headers-row" style="margin-bottom:8px">')
  html.push(`<div class="col" style="background:#f7f7f7;font-weight:700">${escapeHtml(leftLabel || 'DOCX')}</div>`)
  html.push(`<div class="col" style="background:#f7f7f7;font-weight:700">${escapeHtml(rightLabel || 'Markdown')}</div>`)
  html.push('</div>')
  for (const r of rows) {
    html.push(`<section><h2>${escapeHtml(r.title)}</h2><div class="row"><div class="col">${r.left || '<em>(empty)</em>'}</div><div class="col">${r.right || '<em>(empty)</em>'}</div></div></section>`)
  }
  html.push('</body></html>')
  return html.join('\n')
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function main() {
  if (!fs.existsSync(docxPath)) {
    console.error('DOCX not found:', docxPath)
    process.exit(2)
  }
  if (!fs.existsSync(mdPath)) {
    console.error('Markdown not found:', mdPath)
    process.exit(2)
  }

  console.log('Extracting DOCX:', docxPath)
  const docxText = await extractDocx(docxPath)
  console.log('Reading Markdown:', mdPath)
  const mdText = readMd(mdPath)

  let a = normalize(docxText)
  let b = normalize(mdText)
  if (ignoreMarkdown) b = stripMarkdownFormatting(b)

  const outDir = path.resolve(outDirArg || 'reports')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  if (paragraphMode) {
    const parasA = splitParagraphs(a)
    const parasB = splitParagraphs(b)

    const paraDocxPath = path.join(outDir, 'docx.paragraphs.txt')
    const paraMdPath = path.join(outDir, 'md.paragraphs.txt')
    fs.writeFileSync(paraDocxPath, parasA.join('\n\n'), 'utf8')
    fs.writeFileSync(paraMdPath, parasB.join('\n\n'), 'utf8')

    const diff = spawnSync('diff', ['-u', paraDocxPath, paraMdPath], {encoding: 'utf8'})
    const diffOut = diff.stdout || diff.stderr || ''
    fs.writeFileSync(path.join(outDir, 'report.paragraph.diff.txt'), diffOut, 'utf8')

    const added = (diffOut.match(/^\+/gm) || []).length
    const removed = (diffOut.match(/^-+/gm) || []).length
    const summary = { added, removed, paragraphsA: parasA.length, paragraphsB: parasB.length }
    fs.writeFileSync(path.join(outDir, 'report.paragraph.summary.json'), JSON.stringify(summary, null, 2), 'utf8')

    console.log('Paragraph reports written to', outDir)
    console.log('Paragraph diff summary:', summary)
    return
  }

  if (sectionMode) {
    // sectionsB from markdown
    const sectionsB = splitSections(b)
    // try to extract structured sections from DOCX via HTML parse
    let sectionsA = await extractDocxHtmlParagraphs(docxPath)
    // if extraction yielded only one big section, try to split docx text by md headings
    if (sectionsA.length <= 1) {
      const fallback = splitDocxByMdHeadings(a, sectionsB)
      if (fallback && fallback.length) sectionsA = fallback
    }
    // if DOCX has a leading title (e.g. document title) that isn't in MD titles,
    // but MD has an Intro section, map DOCX first section to 'Intro' so it aligns
    try {
      const mdTitles = new Set(sectionsB.map(s => s.title.toLowerCase()))
      if (sectionsB.length && sectionsB[0].title.toLowerCase() === 'intro' && sectionsA.length) {
        const firstTitle = (sectionsA[0].title || '').toLowerCase()
        if (firstTitle && !mdTitles.has(firstTitle)) {
          sectionsA[0].title = 'Intro'
        }
      }
    } catch (e) {
      // ignore
    }

    const secDocxPath = path.join(outDir, 'docx.sections.txt')
    const secMdPath = path.join(outDir, 'md.sections.txt')
    fs.writeFileSync(secDocxPath, sectionsA.map(s => `# ${s.title}\n\n${s.body}`).join('\n\n'), 'utf8')
    fs.writeFileSync(secMdPath, sectionsB.map(s => `# ${s.title}\n\n${s.body}`).join('\n\n'), 'utf8')

    const diff = spawnSync('diff', ['-u', secDocxPath, secMdPath], {encoding: 'utf8'})
    const diffOut = diff.stdout || diff.stderr || ''
    fs.writeFileSync(path.join(outDir, 'report.section.diff.txt'), diffOut, 'utf8')

    const added = (diffOut.match(/^\+/gm) || []).length
    const removed = (diffOut.match(/^-+/gm) || []).length
    const summary = { added, removed, sectionsA: sectionsA.length, sectionsB: sectionsB.length }
    fs.writeFileSync(path.join(outDir, 'report.section.summary.json'), JSON.stringify(summary, null, 2), 'utf8')

    if (htmlOutput) {
      const leftLabel = path.basename(docxPath)
      const rightLabel = path.basename(mdPath)
      const html = makeSideBySideHtml(sectionsA, sectionsB, leftLabel, rightLabel)
      const outPath = path.join(outDir, 'report.side-by-side.html')
      fs.writeFileSync(outPath, html, 'utf8')
      console.log('HTML written to', outPath)
    }

    console.log('Section reports written to', outDir)
    console.log('Section diff summary:', summary)
    return
  }
  const docxTxtPath = path.join(outDir, 'docx.txt')
  const mdTxtPath = path.join(outDir, 'md.txt')
  fs.writeFileSync(docxTxtPath, a, 'utf8')
  fs.writeFileSync(mdTxtPath, b, 'utf8')

  // run diff -u
  const diff = spawnSync('diff', ['-u', docxTxtPath, mdTxtPath], {encoding: 'utf8'})
  const diffOut = diff.stdout || diff.stderr || ''
  const diffPath = path.join(outDir, 'report.diff.txt')
  fs.writeFileSync(diffPath, diffOut, 'utf8')

  // summary
  const added = (diffOut.match(/^\+/gm) || []).length
  const removed = (diffOut.match(/^-+/gm) || []).length
  const summary = { added, removed }
  fs.writeFileSync(path.join(outDir, 'report.summary.json'), JSON.stringify(summary, null, 2), 'utf8')

  console.log('Reports written to', outDir)
  console.log('Diff summary:', summary)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
