import { EditorView, Decoration, ViewPlugin, keymap } from '@codemirror/view'
import { RangeSetBuilder, EditorState } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { searchKeymap } from '@codemirror/search'
import { bracketMatching } from '@codemirror/language'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'

interface Position {
  line: number;
  column: number;
  offset?: number;
}

interface PositionRange {
  start: Position;
  end: Position;
}

interface RemarkNode extends Node {
  type: string;
  position?: PositionRange;
  depth?: number;
  value?: string;
  url?: string;
  children?: RemarkNode[];
}

// Interface for collected decorations
interface DecorationInfo {
  from: number;
  to: number;
  decoration: Decoration;
}

const processor = remark()
  .use(remarkGfm)
  .use(remarkFrontmatter, ['yaml', 'toml'])

const enhancedRemarkHighlighter = ViewPlugin.fromClass(class {
  decorations: any

  constructor(view: EditorView) {
    this.decorations = this.buildDecorations(view)
  }

  update(update: any): void {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view)
    }
  }

  buildDecorations(view: EditorView) {
    const builder = new RangeSetBuilder<Decoration>()
    const doc = view.state.doc
    const text = doc.toString()

    try {
      const tree = processor.parse(text) as RemarkNode
      
      // Collect all decorations first
      const decorations: DecorationInfo[] = []
      this.collectDecorations(tree, text, decorations)
      
      // Sort decorations by position
      decorations.sort((a, b) => {
        if (a.from !== b.from) return a.from - b.from
        return a.to - b.to
      })
      
      // Add decorations in sorted order
      for (const dec of decorations) {
        builder.add(dec.from, dec.to, dec.decoration)
      }
      
      return builder.finish()
    } catch (error) {
      console.warn('Remark parsing error:', error)
      return Decoration.none
    }
  }

  collectDecorations(node: RemarkNode, fullText: string, decorations: DecorationInfo[]): void {
    if (!node.position) return

    const start = this.getOffset(node.position.start, fullText)
    const end = this.getOffset(node.position.end, fullText)

    // Skip if invalid range
    if (start >= end || start < 0 || end > fullText.length) return

    switch (node.type) {
      case 'strong':
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({ class: 'cm-strong' })
        })
        this.addFormattingMarkers(decorations, fullText, start, end, '**')
        break

      case 'emphasis':
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({ class: 'cm-emphasis' })
        })
        this.addFormattingMarkers(decorations, fullText, start, end, '*')
        break

      case 'text':
        decorations.push({
          from:start,
          to:end,
          decoration: Decoration.mark({class: 'cm-text'})
        })
        break;

      case 'delete':
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({ class: 'cm-strikethrough' })
        })
        this.addFormattingMarkers(decorations, fullText, start, end, '~~')
        break

      case 'heading':
        const depth = node.depth || 1
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({ class: `cm-header cm-header-${depth}` })
        })
        
        // Handle # markers
        const headerStart = fullText.indexOf('#'.repeat(depth), start)
        if (headerStart !== -1 && headerStart < end) {
          decorations.push({
            from: headerStart,
            to: headerStart + depth,
            decoration: Decoration.mark({ class: 'cm-formatting cm-formatting-header' })
          })
        }
        break

      case 'inlineCode':
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({ class: 'cm-inline-code' })
        })
        this.addFormattingMarkers(decorations, fullText, start, end, '`')
        break

      case 'code':
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({ class: 'cm-code-block' })
        })
        
        // Handle ``` markers more carefully
        const snippet = fullText.slice(start, end)
        const codeBlockStart = snippet.indexOf('```')
        const codeBlockEnd = snippet.lastIndexOf('```')
        console.log(node.textContent)
        
        if (codeBlockStart !== -1 && codeBlockStart !== codeBlockEnd) {
          decorations.push({
            from: start + codeBlockStart,
            to: start + codeBlockStart + 3,
            decoration: Decoration.mark({ class: 'cm-formatting cm-formatting-code-block' })
          })
          decorations.push({
            from: start + codeBlockEnd,
            to: start + codeBlockEnd + 3,
            decoration: Decoration.mark({ class: 'cm-formatting cm-formatting-code-block' })
          })
        }
        break

      case 'link':
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({ class: 'cm-link' })
        })
        break

      case 'image':
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({ class: 'cm-image' })
        })
        break

      case 'blockquote':
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({ class: 'cm-blockquote' })
        })
        
        // Handle > markers more carefully
        const lines = fullText.slice(start, end).split('\n')
        let currentPos = start
        lines.forEach(line => {
          const trimmed = line.trim()
          if (trimmed.startsWith('>')) {
            const markerPos = fullText.indexOf('>', currentPos)
            if (markerPos !== -1 && markerPos < currentPos + line.length) {
              decorations.push({
                from: markerPos,
                to: markerPos + 1,
                decoration: Decoration.mark({ class: 'cm-formatting cm-formatting-quote' })
              })
            }
          }
          currentPos += line.length + 1
        })
        break

      case 'list':
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({ class: 'cm-list' })
        })
        break

      case 'html':
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({class: 'cm-list'})
        })
        break;

      case 'listItem':
        const itemText = fullText.slice(start, end)
        const bulletMatch = itemText.match(/^(\s*)([-*+]|\d+\.)\s/)
        if (bulletMatch) {
          const markerStart = start + bulletMatch[1].length
          const markerEnd = markerStart + bulletMatch[2].length
          if (markerStart < markerEnd && markerEnd <= end) {
            decorations.push({
              from: markerStart,
              to: markerEnd,
              decoration: Decoration.mark({ class: 'cm-formatting cm-formatting-list' })
            })
          }
        }
        break

      case 'table':
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({ class: 'cm-table' })
        })
        break

      case 'yaml':
        decorations.push({
          from: start,
          to: end,
          decoration: Decoration.mark({ class: 'cm-frontmatter' })
        })
        break
    }

    // Process children recursively
    if (node.children) {
      node.children.forEach(child => this.collectDecorations(child, fullText, decorations))
    }
  }

  addFormattingMarkers(decorations: DecorationInfo[], text: string, start: number, end: number, marker: string): void {
    const markerLen = marker.length
    const snippet = text.slice(start, end)
    
    if (snippet.startsWith(marker) && snippet.endsWith(marker) && start + markerLen < end - markerLen) {
      // Start marker
      decorations.push({
        from: start,
        to: start + markerLen,
        decoration: Decoration.mark({ class: 'cm-formatting' })
      })
      
      // End marker
      decorations.push({
        from: end - markerLen,
        to: end,
        decoration: Decoration.mark({ class: 'cm-formatting' })
      })
    }
  }

  getOffset(position: Position, text: string): number {
    const lines = text.split('\n')
    let offset = 0
    
    for (let i = 0; i < Math.min(position.line - 1, lines.length); i++) {
      offset += lines[i].length + 1 // +1 for newline
    }
    
    return offset + Math.max(0, position.column - 1)
  }
}, {
  decorations: (v: any) => v.decorations
})

// Enhanced theme (same as before)
const enhancedTheme = EditorView.theme({
  '.cm-strong': { fontWeight: 'bold' },
  '.cm-emphasis': { fontStyle: 'italic' },
  '.cm-strikethrough': { textDecoration: 'line-through' },

  '.cm-text': {
    fontWeight: 'semibold', 
    fontFamily: 'ui-monospace, SFMono-Regular, "SF mono"',
    letterSpacing: '0.08em',
    fontSize: '1.07em' 
  }, 
  '.cm-formatting': {
    opacity: '0.4',
    fontSize: '0.9em',
    color: '#6b7280',
  },
  
  '.cm-header': {
    fontWeight: 'bold',
    lineHeight: '1.4',
    marginTop: '0.5em',
    marginBottom: '0.3em',
  },
  '.cm-header-1': { fontSize: '2em', color: '#1f2937', borderBottom: '2px solid #e5e7eb' },
  '.cm-header-2': { fontSize: '1.5em', color: '#374151' },
  '.cm-header-3': { fontSize: '1.25em', color: '#4b5563' },
  '.cm-header-4': { fontSize: '1.1em', color: '#6b7280' },
  '.cm-header-5': { fontSize: '1em', color: '#9ca3af' },
  '.cm-header-6': { fontSize: '0.9em', color: '#d1d5db' },
  
  '.cm-inline-code': {
    backgroundColor: '#f1f1f1',
    padding: '2px 4px',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    fontSize: '0.85em',
    color: '#c7254e',
  },
  
  '.cm-code-block': {
    padding: '12px 16px',
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    fontSize: '13px',
    lineHeight: '1.4',
    color: '#333',
    margin: '10px 0',
  },
  
  '.cm-link': {
    color: '#2563eb',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  
  '.cm-image': {
    color: '#059669',
    fontWeight: '500',
  },
  
  '.cm-blockquote': {
    borderLeft: '4px solid #e5e7eb',
    paddingLeft: '16px',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  
  '.cm-list': {
    paddingLeft: '20px',
    marginTop: '8px',
    marginBottom: '8px',
    padding: '8px 16px',
    lineHeight: '1.6',
  },
  
  '.cm-table': {
    borderCollapse: 'collapse',
    width: '100%',
  },
  
  '.cm-frontmatter': {
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    padding: '8px',
    fontSize: '0.875em',
    color: '#475569',
  },
  
  '.cm-cursor': {
    borderLeft: '4px solid #1f2937 !important',
    zIndex: '1000 !important',
  },

  '.cm-editor.cm-focused': {
    outline: 'none !important'
  },
  
  '.cm-focused .cm-cursor': {
    borderLeftColor: '#2563eb !important',
  }
})

export function enhancedRemarkMarkdown() {
  return [
    // Essential editing functionality
    history(),
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...searchKeymap,
    ]),
    bracketMatching(),
    
    // Custom markdown highlighting
    enhancedRemarkHighlighter,
    enhancedTheme,
    
    // Basic editor configuration
    EditorView.lineWrapping,
    EditorState.allowMultipleSelections.of(true),
    
    // Editor styling
    EditorView.theme({
      '&': {
        fontSize: '14px',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      },
      '.cm-content': {
        padding: '16px',
        minHeight: '100%',
      },
      '.cm-editor': {
        outline: 'none !important',
      },
      '.cm-editor.cm-focused': {
        outline: 'none !important',
      },
      '.cm-focused': {
        outline: 'none !important',
      },
      '&.cm-editor.cm-focused': {
        outline: 'none !important',
      },
      '&.cm-focused': {
        outline: 'none !important',
      }
    })
  ]
}