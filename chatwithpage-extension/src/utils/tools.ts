import { Table } from 'lucide-react';
import Mark from 'mark.js/dist/mark.es6.js';

const options = {
  "element": "mark",
  "exclude": [],
  "separateWordSearch": false,
  "accuracy": "exactly",
  "acrossElements": true,
};

type ProcessTextOptions = {
  maxChunkLength?: number;
  overlap?: number;
  minChunkLength?: number;
};

export function processText(
  rawText: string,
  { maxChunkLength = 600, minChunkLength = 200, overlap = 1 }: ProcessTextOptions = {}
): string[] {
  // Split by newline to separate different elements
  const lines = rawText.split('\n').filter(line => line.trim().length > 0);

  let chunks = [];

  lines.forEach(line => {
    let temp = '';
    let words = line.split(' ');

    for (let i = 0; i < words.length; i++) {
      if ((temp + ' ' + words[i]).trim().length <= maxChunkLength) {
        temp += ' ' + words[i];
      } else {
        if (/\w/.test(temp) && (temp.match(/\b\w+\b/g) || []).length >= 2 && temp.trim().length >= minChunkLength) {
          chunks.push(temp.trim());
        }
        temp = words.slice(i - overlap + 1, i + 1).join(' ');
      }
    }

    if (temp.trim().length > 0 && /\w/.test(temp) && (temp.match(/\b\w+\b/g) || []).length >= 2 && temp.trim().length >= minChunkLength) {
      chunks.push(temp.trim());
    }
  });
  // make a set to remove duplicates
  chunks = [...new Set(chunks)];


  return chunks;

}

export function highlightText(targetText, specialOptions=null){
  var instance = new Mark(document.querySelector("body"))
  let updatedOptions = options;
  if(specialOptions){
    updatedOptions = {...options, ...specialOptions}
  }
  instance.mark(targetText, updatedOptions)
}


export function clearHighlights(){
  var instance = new Mark(document.querySelector("body"))
  instance.unmark();
}