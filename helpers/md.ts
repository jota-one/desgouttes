import markdownParser from '@nuxt/content/transformers/markdown'

// first arg to parse() is for id, which is unused
export const parseMarkdown = (md: string) =>
  markdownParser.parse('custom.md', md)
