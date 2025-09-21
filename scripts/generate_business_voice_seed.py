
from __future__ import annotations
import json
from pathlib import Path

questions = []

def add(question):
    questions.append(question)

# questions.append(...) # TODO

if __name__ == '__main__':
    Path('data').mkdir(exist_ok=True)
    output = Path('data/business_voice_seed.json')
    output.write_text(json.dumps({"questions": questions}, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Wrote {len(questions)} questions to {output}')
