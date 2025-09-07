import {  highlightActiveLine } from '@codemirror/view';
import {  history } from '@codemirror/commands';
import { bracketMatching, indentOnInput } from '@codemirror/language';
import {  closeBrackets } from '@codemirror/autocomplete';
import { vim } from '@replit/codemirror-vim'; // ← lowercase import
import { enhancedRemarkMarkdown } from './remark';

export const basicExtensions = [
  vim(),  
  history(),
  indentOnInput(),
  bracketMatching(),
  highlightActiveLine(),
  enhancedRemarkMarkdown(),
  closeBrackets(),
  // EditorView.updateListener.of(update => {
  //   if (update.docChanged) {
  //     console.log('Document updated for live preview');
  //   }
  // })
];
