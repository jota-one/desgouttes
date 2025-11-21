#!/usr/bin/env node
// scripts/generate-global-report.js
// Scans content/en/2.practice-areas for .md files, finds matching DOCX in originals/expertises,
// runs scripts/compare-docx-md.js for each pair, writes per-file reports to reports/by-file/<slug>/
// and aggregates a single reports/global-report.html + reports/global-summary.json

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const workspaceRoot = process.cwd()
const mdDir = path.resolve('content/en/2.practice-areas')
const docxDir = path.resolve('originals/expertises')
const outRoot = path.resolve('reports')
const perFileRoot = path.join(outRoot, 'by-file')

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function findBestDocxForMd(mdName, docxFiles) {
  // heuristic: compare base names (ignore dates and punctuation)
  const base = mdName.replace(/[^a-z0-9]+/gi, ' ').trim().toLowerCase()
  let best = null
  let bestScore = 0
  for (const f of docxFiles) {
    const bn = path.basename(f, path.extname(f)).replace(/[^a-z0-9]+/gi, ' ').trim().toLowerCase()
    // score = number of shared words
    const a = new Set(base.split(/\s+/))
    const b = new Set(bn.split(/\s+/))
    let common = 0
    for (const w of a) if (w && b.has(w)) common++
    if (common > bestScore) { bestScore = common; best = f }
  }
  return { file: best, score: bestScore }
}

function readMdFiles() {
  const files = fs.readdirSync(mdDir).filter(f => f.endsWith('.md') && !f.startsWith('.'))
  return files.map(f => path.join(mdDir, f))
}

function readDocxFiles() {
  if (!fs.existsSync(docxDir)) return []
  const files = fs.readdirSync(docxDir).filter(f => f.toLowerCase().endsWith('.docx'))
  return files.map(f => path.join(docxDir, f))
}

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }

async function main() {
  ensureDir(outRoot)
  ensureDir(perFileRoot)

  const mdFiles = readMdFiles()
  const docxFiles = readDocxFiles()

  if (!mdFiles.length) {
    console.error('No markdown files found in', mdDir)
    process.exit(1)
  }

  const summary = []
  const aggregatedHtmlParts = []

  for (const md of mdFiles) {
    const mdBase = path.basename(md, '.md')
    const slug = slugify(mdBase)
    const perOut = path.join(perFileRoot, slug)
    ensureDir(perOut)

    const { file: docxMatch, score } = findBestDocxForMd(mdBase, docxFiles)
    if (!docxMatch) {
      summary.push({ md: md, docx: null, status: 'no-docx-found' })
      continue
    }

    console.log('Comparing', md, '↔', docxMatch, '(score', score + ')')
    // run the compare script
    const args = [path.join('scripts', 'compare-docx-md.js'), '--docx', docxMatch, '--md', md, '--section', '--html', '--ignore-markdown', '--tolerant', '--outDir', perOut]
    const res = spawnSync('node', args, { encoding: 'utf8' })
    if (res.error) {
      summary.push({ md, docx: docxMatch, status: 'error', error: res.error.message })
      continue
    }
    // read per-file html if exists
    const htmlPath = path.join(perOut, 'report.side-by-side.html')
    let htmlContent = ''
    if (fs.existsSync(htmlPath)) {
      htmlContent = fs.readFileSync(htmlPath, 'utf8')
      // extract body content between <body>...</body>
      const m = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i)
      const body = m ? m[1] : htmlContent
      // add an anchor header for this file
      const title = mdBase.replace(/[-_]+/g, ' ')
      aggregatedHtmlParts.push(`<section id="${slug}"><h1>${escapeHtml(title)}</h1>${body}</section>`) 
      summary.push({ md: md, docx: docxMatch, status: 'ok', score })
    } else {
      summary.push({ md: md, docx: docxMatch, status: 'no-html', score })
    }
  }

  // build global report
  const globalHtml = []
  globalHtml.push('<!doctype html><html><head><meta charset="utf-8"><title>Global Comparison report</title>')
  globalHtml.push('<style>body{font-family: Arial, Helvetica, sans-serif; padding:20px} .nav{position:fixed;left:0;top:0;background:#fff;border-right:1px solid #eee;padding:10px;max-height:100vh;overflow:auto;width:220px} .content{margin-left:240px;padding:20px} h1{font-size:20px} h2{font-size:16px} .row{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:30px} .col{padding:10px;border:1px solid #eee;background:#fff} del{color:#900;text-decoration:none} ins{color:#060;text-decoration:none}</style>')
  globalHtml.push('</head><body>')
  globalHtml.push('<div class="nav"><h2>Reports</h2><ul>')
  for (const md of readMdFiles()) {
    const mdBase = path.basename(md, '.md')
    const slug = slugify(mdBase)
    globalHtml.push(`<li><a href="#${slug}">${escapeHtml(mdBase)}</a></li>`)
  }
  globalHtml.push('</ul></div>')
  globalHtml.push('<div class="content">')
  globalHtml.push(`<h1>Global Comparison report - ${new Date().toISOString()}</h1>`)
  globalHtml.push(aggregatedHtmlParts.join('\n'))
  globalHtml.push('</div></body></html>')

  const globalPath = path.join(outRoot, 'global-report.html')
  fs.writeFileSync(globalPath, globalHtml.join('\n'), 'utf8')

  const summaryPath = path.join(outRoot, 'global-summary.json')
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8')

  console.log('Global report written to', globalPath)
  console.log('Global summary written to', summaryPath)
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

main()
