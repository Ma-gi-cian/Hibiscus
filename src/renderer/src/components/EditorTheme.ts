import { createTheme } from '@uiw/codemirror-themes';
import { EditorView } from '@codemirror/view';

export const basicTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#fefefe',
    foreground: '#2c3e50',
    caret: '#3498db',
    selection: 'rgba(52, 152, 219, 0.2)',
    lineHighlight: 'rgba(52, 152, 219, 0.05)',
  },
  styles: []
});

export const basic = EditorView.theme({
  '&': {
    fontSize: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  '.cm-content': {
    padding: '2em',
    lineHeight: '1.6',
    'caret-color': '#3498db',
  },
  '.cm-line-Wrapping': {
    padding: '0'
  },
  '.cm-focused': {
    outline: 'none'
  },
  '.cm-editor': {
    fontSize: '16px'
  },
  '.cm-scroller': {
    fontFamily: 'inherit'
  },
  '.cm-line': {
    padding: '0 0',
    marginBottom: '0.2em'
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(52, 152, 219, 0.05)'
  },
  '.cm-selectionBackground': {
    backgroundColor: 'rgba(52, 152, 219, 0.2)'
  },
  
  // Markdown element styling
  '.cm-md-heading': {
    display: 'block',
    margin: '1em 0 0.5em 0'
  },
  
  '.cm-editor .cm-md-list': {
    borderLeft: 'none !important',
    display: 'inline !important',
    backgroundColor: 'transparent !important',
    border: 'none !important',
    margin: '0 !important',
    padding: '0 !important',
    lineHeight: 'inherit !important'
  },
  
  // Not working need to do something new
  '.cm-editor .cm-list': {
    borderLeft: 'none !important',
    backgroundColor: 'transparent !important',
    border: 'none !important',
    margin: '0 !important',
    padding: '0 !important',
    lineHeight: 'inherit !important'
  },
  
  // Hope this works to solve the conflict 
  '&.cm-editor .cm-list': {
    borderLeft: 'none !important',
    backgroundColor: 'transparent !important',
    border: 'none !important',
    margin: '0 !important',
    padding: '0 !important',
    lineHeight: 'inherit !important'
  },
  
  // Bold markdown styling
  '.cm-md-bold': {
    fontWeight: '700',
    color: '#2c3e50'
  },
  
  // Italic markdown styling
  '.cm-md-italic': {
    fontStyle: 'italic',
    color: '#34495e'
  },
  
  // Link markdown styling
  '.cm-md-link': {
    color: '#3498db',
    textDecoration: 'none',
    borderBottom: '1px solid transparent',
    '&:hover': {
      borderBottom: '1px solid #3498db'
    }
  },
  
  // Code block styling
  '.cm-md-code': {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '4px',
    padding: '2px 4px',
    fontFamily: '"Fira Code", "SF Mono", Monaco, Consolas, monospace',
    fontSize: '0.875em'
  },
  
  // Blockquote styling
  '.cm-md-blockquote': {
    borderLeft: '4px solid ',
    paddingLeft: '1em',
    fontStyle: 'italic',
    color: 'black',
    backgroundColor: 'rgba(52, 152, 219, 0.05)',
    borderRadius: '0 4px 4px 0'
  },
  
  // Clean minimal scrollbar
  '.cm-scroller::-webkit-scrollbar': {
    width: '8px'
  },
  '.cm-scroller::-webkit-scrollbar-track': {
    background: '#f1f1f1'
  },
  '.cm-scroller::-webkit-scrollbar-thumb': {
    background: '#c1c1c1',
    borderRadius: '4px'
  },
  '.cm-scroller::-webkit-scrollbar-thumb:hover': {
    background: '#a1a1a1'
  }
});