import nunjucks from 'nunjucks';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export class MarkdownTag {
  constructor() {
    this.tags = ['markdown'];
  }

  parse(parser, nodes) {
    const tok = parser.nextToken(); // {% markdown %}
    const args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    const body = parser.parseUntilBlocks('endmarkdown');
    parser.advanceAfterBlockEnd(); // {% endmarkdown %}

    return new nodes.CallExtension(this, 'run', args, [body]);
  }

  run(context, body) {
    const content = body();
    return new nunjucks.runtime.SafeString(md.render(content));
  }
}
