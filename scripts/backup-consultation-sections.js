const fs = require('fs-extra');
const path = require('path');
const ts = require('typescript');

const SECTION_CONFIG = [
  {
    id: 'ConsultationHero',
    filename: 'ConsultationHero.tsx',
    nodes: ['ConsultationHero'],
    description: '상담신청 히어로 섹션'
  },
  {
    id: 'FaqSection',
    filename: 'FaqSection.tsx',
    nodes: ['FaqAnswer', 'FaqCard', 'FaqSection'],
    description: '자주 묻는 질문 섹션 (카드/답변 포함)'
  },
  {
    id: 'QuickConsultForm',
    filename: 'QuickConsultForm.tsx',
    nodes: [
      'ConsultationFormState',
      'ConsultationFormErrors',
      'INITIAL_FORM_STATE',
      'formatPhoneNumber',
      'formatBusinessNumber',
      'classNames',
      'CONSULTATION_TYPE_ICONS',
      'FormStep',
      'FORM_STEPS',
      'STEP_REQUIRED_FIELDS',
      'STEP_ALL_FIELDS',
      'QuickConsultState',
      'QuickConsultAction',
      'INITIAL_REDUCER_STATE',
      'quickConsultReducer',
      'PHONE_MIN_LENGTH',
      'PRIVACY_DETAIL',
      'INFO_BENEFITS',
      'INFO_HIGHLIGHTS',
      'getConsultTypeLabel',
      'validateContactStep',
      'validateBusinessStep',
      'validateDetailsStep',
      'validateStep',
      'validateAll',
      'focusFirstError',
      'StepProgress',
      'StepPanel',
      'StepActions',
      'FormSummary',
      'InfoCard',
      'QuickConsultForm'
    ],
    description: '빠른 상담 신청 폼 전체 (타입·유틸 포함)'
  },
  {
    id: 'CtaSection',
    filename: 'CtaSection.tsx',
    nodes: ['CtaSection'],
    description: '마지막 CTA 섹션'
  },
];

const ADDITIONAL_FILES = [
  { source: ['src', 'app', 'consultation-request', 'page.tsx'], target: 'page.tsx' },
  { source: ['src', 'app', 'consultation-request', 'page.css'], target: 'page.css' },
  { source: ['src', 'app', 'consultation-request', 'QuickConsultForm.module.css'], target: 'QuickConsultForm.module.css' },
];

function formatTimestamp(date) {
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}_${hh}${mi}${ss}`;
}

function collectNamedNodes(sourceFile, sourceText) {
  const nodes = new Map();

  function addEntry(name, node) {
    if (!name) return;
    if (!nodes.has(name)) {
      const text = sourceText.slice(node.getFullStart(), node.end);
      nodes.set(name, { node, text });
    }
  }

  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      addEntry(node.name.text, node);
    } else if (ts.isTypeAliasDeclaration(node)) {
      addEntry(node.name.text, node);
    } else if (ts.isInterfaceDeclaration(node)) {
      addEntry(node.name.text, node);
    } else if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach((decl) => {
        if (ts.isIdentifier(decl.name)) {
          addEntry(decl.name.text, node);
        }
      });
    }
    node.forEachChild(visit);
  }

  visit(sourceFile);
  return nodes;
}

async function writeSectionFile(baseDir, section, pieces, timestamp) {
  const filePath = path.join(baseDir, section.filename);
  const headerLines = [
    `// Backup: ${section.id} (생성 시각: ${timestamp})`,
    `// 원본: src/app/consultation-request/page.tsx`,
    `// 설명: ${section.description}`,
    '',
  ];
  const content = headerLines.join('\n') + pieces.join('\n');
  await fs.writeFile(filePath, content, 'utf8');
  return filePath;
}

async function copyAdditionalFiles(baseDir, timestamp) {
  const copied = [];
  for (const file of ADDITIONAL_FILES) {
    const sourcePath = path.join(process.cwd(), ...file.source);
    if (!(await fs.pathExists(sourcePath))) {
      continue;
    }
    const targetPath = path.join(baseDir, file.target);
    await fs.ensureDir(path.dirname(targetPath));
    await fs.copyFile(sourcePath, targetPath);
    copied.push({ source: file.source.join(path.sep), target: file.target });
  }
  return copied;
}

async function main() {
  const now = new Date();
  const timestamp = formatTimestamp(now);
  const sourcePath = path.join(process.cwd(), 'src', 'app', 'consultation-request', 'page.tsx');
  const sourceText = await fs.readFile(sourcePath, 'utf8');
  const sourceFile = ts.createSourceFile('page.tsx', sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const namedNodes = collectNamedNodes(sourceFile, sourceText);

  const backupDir = path.join(process.cwd(), 'backups', 'consultation-request', 'sections', timestamp);
  await fs.ensureDir(backupDir);

  const manifest = {
    generatedAt: now.toISOString(),
    sourceFile: 'src/app/consultation-request/page.tsx',
    sections: [],
    additionalFiles: [],
  };

  for (const section of SECTION_CONFIG) {
    const missing = section.nodes.filter((name) => !namedNodes.has(name));
    if (missing.length > 0) {
      throw new Error(`백업할 노드를 찾을 수 없습니다: ${missing.join(', ')}`);
    }
    const pieces = section.nodes.map((name) => namedNodes.get(name).text.trimStart());
    const filePath = await writeSectionFile(backupDir, section, pieces, timestamp);
    manifest.sections.push({ id: section.id, file: path.relative(backupDir, filePath).replace(/\\/g, '/'), nodes: section.nodes });
  }

  const extra = await copyAdditionalFiles(backupDir, timestamp);
  manifest.additionalFiles = extra;

  const manifestPath = path.join(backupDir, 'manifest.json');
  await fs.writeJson(manifestPath, manifest, { spaces: 2 });

  const readmePath = path.join(backupDir, 'README.md');
  const readmeLines = [
    '# 상담신청 페이지 섹션 백업',
    '',
    `- 생성 시각: ${timestamp}`,
    '- 원본 경로: `src/app/consultation-request/page.tsx`',
    '',
    '## 포함된 섹션',
    ...manifest.sections.map((section) => `- ${section.id}: ${section.file}`),
    '',
    '## 참고',
    '- `page.tsx`, `page.css`, `QuickConsultForm.module.css` 원본도 함께 복사되었습니다.',
    '- QuickConsultForm 백업에는 폼에서 사용하는 타입/유틸 함수가 모두 포함되어 있습니다.',
  ];
  await fs.writeFile(readmePath, readmeLines.join('\n'), 'utf8');

  console.log('✅ 상담신청 페이지 섹션 백업이 완료되었습니다.');
  console.log(`   위치: ${backupDir}`);
}

main().catch((error) => {
  console.error('❌ 백업 생성 중 오류가 발생했습니다.');
  console.error(error);
  process.exit(1);
});
