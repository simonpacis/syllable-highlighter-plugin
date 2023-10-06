import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import {
	Decoration,
	DecorationSet,
	EditorView,
	PluginSpec,
	PluginValue,
	ViewPlugin,
	ViewUpdate,
	WidgetType,
} from "@codemirror/view";
import { EmojiWidget } from "widget";
import {syllable} from 'syllable';
import {syllableRegex} from './syllable-regex';

class HighlighterPlugin implements PluginValue {
	decorations: DecorationSet;
	enabled: boolean;

	constructor(view: EditorView) {
		this.decorations = this.buildDecorations(view);
		this.enabled = true;
	}

	setEnabled(set: boolean, view: EditorView) {
		this.enabled = set;
		if(set)
		{
			this.buildDecorations(view);
		}
	}

	update(update: ViewUpdate) {
		if (update.docChanged || update.viewportChanged) {
			this.decorations = this.buildDecorations(update.view);
		}
	}

	destroy() {}

	isAlphaNumeric(str: string) {
		let code, i, len;

		for (i = 0, len = str.length; i < len; i++) {
			code = str.charCodeAt(i);
			if (!(code > 47 && code < 58) && // numeric (0-9)
					!(code > 64 && code < 91) && // upper alpha (A-Z)
						!(code > 96 && code < 123)) { // lower alpha (a-z)
				return false;
			}
		}
		return true;
	}

	isPunctuation(str: string) {
		let re;

		re = /[\$\uFFE5\^\+=`~<>{}\[\]|\u3000-\u303F!-#%-\x2A,-/:;\x3F@\x5B-\x5D_\x7B}\u00A1\u00A7\u00AB\u00B6\u00B7\u00BB\u00BF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E3B\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]+/g;

		if(str.match(re) != null)
			 {
				 return true;

			 } else {
				 return false;
			 }

	}

	buildDecorations(view: EditorView): DecorationSet {
		const builder = new RangeSetBuilder<Decoration>();




		/* 
		 *
		 * go through stream of characters
		 *
		 * when encountering a space or linebreak, and the following character is alphanumerical, mark it as beginning of word
		 * when next encountering a space or linebreak, mark the final alphanumerical character as last index of word
		 * */

		let startrange = 0;
		let text = view.state.sliceDoc(view.visibleRanges.from, view.visibleRanges.to);
		let chars = text.split('');
		let word_start_index = -1;
		let word_end_index = -1;
		for(var i = 0; i < chars.length; i++)
		{
			let char = chars[i];
			let char_code = char.charCodeAt(0);
			if((i+1) < chars.length)
			{
				var next_char = chars[(i+1)];
				var next_char_code = next_char.charCodeAt(0);
			} else {
				var next_char = null;
				var next_char_code = 0;
			}
			if(i > 0)
			{
				var prev_char = chars[(i-1)];
				var prev_char_code = prev_char.charCodeAt(0);
			} else {
				var prev_char = null;
				var prev_char_code = 0;
			}


			// Alphanumeric character and previous character was space or linebreak
			if(
					(word_start_index == -1) &&
				  (this.isAlphaNumeric(char)) &&
					(i == 0 || prev_char_code == 32 || prev_char_code == 10)
			  ) // Alphanumeric character and previous character was space or linebreak 
				{
					word_start_index = i;
				}


				if(
					(word_start_index > -1) &&
					(this.isPunctuation(char) || char_code == 32 || char_code == 10))
				{

					word_end_index = i;
					var word = view.state.sliceDoc(word_start_index, word_end_index);
					let deco = Decoration.mark({
						attributes: {style: "font-weight: bold"},
					});

					/*
					 *
					 * Rules:
					 *
					 * 1-2 syllable: 
					 *  If word length is >= 8: highlight three letters
					 * 	If word length is > 3: highlight two letters
					 * 	If word length is <= 3: highlight one letter
					 * 3 syllables:
					 *  If word length is < 12: highlight four letters
					 *  If word length is >= 12: highlight five letters
					 *  
					 *
					 */

					let word_end_highlight_index = -1;
					if(word.length == 1)
					{
							builder.add(word_start_index, (word_start_index+1), deco);
					} else {
							
						let matches = word.match(syllableRegex());
						if(matches != null)
						{
							if((matches.length == 1 || matches.length == 2))
							{
								if(word.length <= 3)
									{
										word_end_highlight_index = (word_start_index + 1);
									} else if((word.length > 3 && word.length < 8)) {
										word_end_highlight_index = (word_start_index + 2);
									} else {
										word_end_highlight_index = (word_start_index + 3);
									}
							} else if(matches.length >= 3) {

								if(word.length < 12)
									{
										word_end_highlight_index = (word_start_index + 4);
									} else if(word.length >= 12) {
										word_end_highlight_index = (word_start_index + 5);
									}

							}
						}
					}


					if(this.enabled && word_end_highlight_index != -1)
						{
							builder.add(word_start_index, word_end_highlight_index, deco);
						}


					word_start_index = -1;
					word_end_index = -1;
				}

				




		}


		return builder.finish();
	}
}

const pluginSpec: PluginSpec<EmojiListPlugin> = {
	decorations: (value: HighlighterPlugin) => value.decorations,
};

	export const highlighterPlugin = ViewPlugin.fromClass(
		HighlighterPlugin,
		pluginSpec
	);
