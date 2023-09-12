import { EditorView, WidgetType, Decoration, ViewPlugin } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { useCalc } from '../context';
import useFormatter from '../hooks/format';
import toast from 'react-hot-toast';

const useResultPlugin = (): () => import("@codemirror/state").Extension[] => {
  const { results } = useCalc();
  const { format } = useFormatter();

  const baseTheme = EditorView.baseTheme({
    '.cm-line-result': { margin: '0 1rem', color: '#a9dc76', appearance: 'none', border: 'none', outline: 'none', background: 'none', padding: '0 0.5rem', 'line-height': 'inherit', float: 'right', display: 'block', 'border-radius': '5px' },
    '.cm-line-result:hover': { background: '#a9dc7699', color: '#1d1f21', 'font-weight': 'bold' }
  });

  const copyTextToClipboard = async (text: string): Promise<void> => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  };

  const copyOnClick = (e: MouseEvent): void => {
    if (e.target && 'parentElement' in e.target && e.target.parentElement.classList.contains('cm-line-result')) {
      copyTextToClipboard((e.target as HTMLElement).textContent || '');
      toast(`Copied "${ (e.target as HTMLElement).textContent }"`);
    }
  };

  class ResultWidget extends WidgetType {
    line: number;
    constructor (line: number) {
      super();
      this.line = line;
    }
    eq(other: ResultWidget): boolean {
      return other.line == this.line;
    }
    toDOM(): HTMLElement {
      let wrap = document.createElement('span');
      let button = wrap.appendChild(document.createElement('button'));
      button.setAttribute('aria-hidden', 'true');
      button.className = 'cm-line-result ';
      let box = button.appendChild(document.createElement('span'));
      let res = results.get(this.line - 1) ? `${ format(results.get(this.line - 1)) }` : null;
      box.textContent = res;
      return wrap;
    }
    ignoreEvent(): boolean {
      return false;
    }
  }

  function resultDeco(view: EditorView): any {
    let builder = new RangeSetBuilder<Decoration>();
    for (let { from, to } of view.visibleRanges) {
      for (let pos = from; pos <= to;) {
        let line = view.state.doc.lineAt(pos);
        let deco = Decoration.widget({
          widget: new ResultWidget(line.number),
          side: 1
        });
        builder.add(line.to, line.to, deco);
        pos = line.to + 1;
      }
    }
    return builder.finish();
  }

  const showResults = ViewPlugin.fromClass(
    class {
      decorations: any;
      constructor (view: EditorView) {
        this.decorations = resultDeco(view);
      }
      update(update: any): void {
        if (update.docChanged || update.viewportChanged) this.decorations = resultDeco(update.view);
      }
    },
    {
      decorations: (v) => v.decorations,
      eventHandlers: {
        mousedown: copyOnClick,
        touchstart: copyOnClick
      }
    }
  );

  return function () {
    return [baseTheme, showResults];
  };
};

export default useResultPlugin;