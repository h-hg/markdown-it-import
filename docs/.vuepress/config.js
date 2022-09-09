import markdownItImport from '../../src/main.js'

export default {
  lang: 'en-US',
  title: 'Markdown-It-Import',
  description: 'The document of Markdown-It-Import',
  pagePatterns: [
    '**/*.md',
    '!.vuepress',
    '!node_modules',
    '!test'
  ],
  extendsMarkdown: (md) => {
    md.use(markdownItImport);
  }
}