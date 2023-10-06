import { EditorView, WidgetType } from "@codemirror/view";

export class EmojiWidget extends WidgetType {
	word: string;
	matches: array;

  constructor(word: string, matches: array) {
		super();
		this.word = word;
		this.matches = matches;
  }

  toDOM(view: EditorView): HTMLElement {
    const div = document.createElement("span");

		console.log(this.matches);
		if(this.matches.length == 1)
			{
				let chars = this.word.split('');
				div.innerHTML = '<span style="font-weight:bold;">' + this.word.substring(0,1) + '</span>' + this.word.substring(1);
			} else if(this.matches.length == 2)
				{
				div.innerHTML = '<span style="font-weight:bold;">' + this.matches[0] + '</span>' + this.matches.splice(1);
			} else if(this.matches.length > 2)
				{
				div.innerHTML = '<span style="font-weight:bold;">' + this.matches[0] + this.matches[1] + '</span>' + this.matches.splice(2);
			}

    return div;
  }
}
