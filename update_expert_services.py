from pathlib import Path
import re

path = Path('src/data/expertServices.ts')
text = path.read_text(encoding='utf-8')

cta_match = re.search(r"export const expertServiceCta: ExpertServiceCta = \{.*?primaryLabel: '(.*?)',\s*secondaryLabel: '(.*?)',\s*\};", text, re.S)
if cta_match:
    primary_label, secondary_label = cta_match.groups()
else:
    primary_label, secondary_label = '무료 상담 신청', '서비스 안내 다시 보기'

hero_block = """export const expertServiceHero: ExpertServiceHero = {
  badge: 'EXPERT SERVICE',
  title: '전문가와 함께하는',
  highlight: '맞춤형 컨설팅',
  subtitleHtml: '법무·세무·노무·행정 등 전문지식이 필요한 영역을 <br />자격을 갖춘 전문가가 직접 동행하며 체계적으로 지원합니다.',
  stats: [],
} as const;\n\n"""

text = re.sub(r"export const expertServiceHero: ExpertServiceHero = \{.*?\} as const;\s*", hero_block, text, count=1, flags=re.S)

cta_block = f"""export const expertServiceCta: ExpertServiceCta = {{
  title: '지금 바로 전문가와\\n상담을 시작해보세요',
  subtitle: '검증된 정책분석 전문가가 1:1로 맞춤 전략을 제안해드립니다.\\n1차 사전상담 100% 무료, 대면상담시 상세 내용 안내가능',
  primaryLabel: '{primary_label}',
  secondaryLabel: '{secondary_label}',
}};\n\n"""

text = re.sub(r"export const expertServiceCta: ExpertServiceCta = \{.*?\};\s*", cta_block, text, count=1, flags=re.S)

path.write_text(text, encoding='utf-8')
