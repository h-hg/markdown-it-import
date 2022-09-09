# Markdown-it-import

An extensible Markdown-it plugin to import external files.

**Attension**:
To be compatible with VuePress v2, markdown-it-import is now released as pure ESM packages.

## Features

Currently, it supports the following files

- Markdown files: Similar to `#include` of C language, the nested import is supported.
- Code snippets

What's more, transclusion is also supported, like lines, fragement tags and regular expression.

## Usage

```bash
npm i vuepress@next markdown-it-import -S
```

configure your `config.js`

```js
import markdownItImport from 'markdown-it-import'

export default {
  extendsMarkdown: (md) => {
    md.use(markdownItImport);
  }
}
```

## Example

Using `@import(type, importPath, optional)` in your markdown files, just like you call javascript function.

- `type`: `string`
- `path`: `string`
- `others`: Javascript Object

### Import Markdown

Exclusive options:

- `recursive`: `bool`, whether to import recursively, default to `true`

Import markdown files without recursion.

:::: code-group
::: code-group-item Markdown Source
@import('code', './test/example.txt', {fragment: '# md import non-recursive'})
:::
::: code-group-item Preview
@import('code', './test/simple-md-import.md', {lang: ''})
:::
::::

Import markdown files recursively.

:::: code-group
::: code-group-item Markdown Source
@import('code', './test/example.txt', {fragment: '# md import'})
:::
::: code-group-item Preview
```
@import('md', './test/simple-md-import.md')
```
:::
::: code-group-item /test/imported.md
@import('code', './test/imported.md')
:::
::::

### Import code

Exclusive options:

- `lang`: `string`, the type of the language, default to the extension of file name.

:::: code-group
::: code-group-item Markdown Source
@import('code', './test/example.txt', {fragment: '# simple code import'})
:::
::: code-group-item Preview
@import('code', './test/helloworld.js', {lang: 'js'})
:::
::::

### Using the transclusion parameter

Options of transclusion (in order of precedence):

- `lines`: `Array`, the line number you want to import
- `fragement`: `string`, the lines between `fragement` will be imported
- `regex`: `Regex`, the lines match the `regex` will be imported

The entire content of `./test/lines.txt` is as follows

@import('code', './test/lines.txt', {lang: 'text'})

Import lines 3 to 8

:::: code-group
::: code-group-item Markdown Source
@import('code', './test/example.txt', {fragment: '# transclusion with line 1'})
:::
::: code-group-item Preview
@import('code', './test/lines.txt', {lang: 'text', lines: [3, 8]})
:::
::::

Import lines 1, 3 to 5, and 8

:::: code-group
::: code-group-item Markdown Source
@import('code', './test/example.txt', {fragment: '# transclusion with line 2'})
:::
::: code-group-item Preview
@import('code', './test/lines.txt', {lang: 'text', lines: [1, [3, 5], 8]})
:::
::::

Import the content between `# tag1`

:::: code-group
::: code-group-item Markdown Source
@import('code', './test/example.txt', {fragment: '# transclusion with tag'})
:::
::: code-group-item Preview
@import('code', './test/lines.txt', {lang: 'text', fragment: '# tag1'})
:::
::::

Using regular expression to import lines 10 to 19

:::: code-group
::: code-group-item Markdown Source
@import('code', './test/example.txt', {fragment: '# transclusion with RE'})
:::
::: code-group-item Preview
@import('code', './test/lines.txt', {lang: 'text', regex: /line\s1[0-9]/})
:::
::::

Complex transclusion

:::: code-group
::: code-group-item Markdown Source
@import('code', './test/example.txt', {fragment: '# complex transclusion'})
:::
::: code-group-item Preview
@import('code', './test/lines.txt', {lang: 'text', line: [6, 20], fragment: '# tag2', regex: /line\s[0-9]$/})
:::
::::
