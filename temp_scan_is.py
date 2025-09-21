from pathlib import Path
text = Path('src/components/examiners/ExaminerAdminPanel.tsx').read_text(encoding='utf-8')
start = text.find("examiner.is")
for idx in range(len(text)):
    if text.startswith('examiner.is', idx):
        snippet = text[idx:idx+40]
        print(snippet.encode('unicode_escape'))
