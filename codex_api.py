import os
import json
import sys
from typing import Optional
import requests
from dotenv import load_dotenv

# .env.local 파일 로드
load_dotenv('.env.local')

# OpenAI API 설정
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'your-api-key-here')
MODEL = 'gpt-5-codex-high'  # GPT-5-Codex High 모델
API_URL = 'https://api.openai.com/v1/chat/completions'


def call_codex(prompt: str, context: str = '') -> Optional[str]:
    """GPT-5-Codex API 호출"""
    try:
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {OPENAI_API_KEY}'
        }

        system_prompt = """You are GPT-5-Codex High, an expert coding assistant specialized in building modern web applications.
        Current project: Next.js 14 homepage with TypeScript/JavaScript, Tailwind CSS, and MongoDB."""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{context}\n\nTask: {prompt}" if context else prompt}
        ]

        payload = {
            "model": MODEL,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 4000
        }

        response = requests.post(API_URL, headers=headers, json=payload)

        if response.status_code != 200:
            error_msg = response.json().get('error', {}).get('message', response.text)
            print(f"❌ API 에러: {error_msg}")
            return None

        data = response.json()
        return data['choices'][0]['message']['content']

    except Exception as e:
        print(f"❌ Codex API 호출 실패: {str(e)}")
        return None


def read_file(filepath: str) -> Optional[str]:
    """파일 읽기"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"⚠️ 파일 읽기 실패 ({filepath}): {str(e)}")
        return None


def write_file(filepath: str, content: str) -> bool:
    """파일 쓰기"""
    try:
        # 디렉토리가 없으면 생성
        os.makedirs(os.path.dirname(filepath) if os.path.dirname(filepath) else '.', exist_ok=True)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ 파일 생성/수정 완료: {filepath}")
        return True
    except Exception as e:
        print(f"❌ 파일 쓰기 실패 ({filepath}): {str(e)}")
        return False


def extract_code_blocks(response: str) -> list:
    """응답에서 코드 블록 추출"""
    import re

    code_blocks = []
    pattern = r'```(?:(\w+))?\s*(?:(?://|#|<!--)\s*)?([^\n]*\.[\w]+)?\n(.*?)```'

    matches = re.findall(pattern, response, re.DOTALL)

    for lang, filename, code in matches:
        code_blocks.append({
            'language': lang,
            'filename': filename.strip() if filename else None,
            'code': code.strip()
        })

    return code_blocks


def build_homepage(request: str) -> Optional[str]:
    """홈페이지 구축 메인 함수"""
    print("🚀 GPT-5-Codex High 모델로 홈페이지 구축 시작...\n")

    # 프로젝트 컨텍스트 준비
    project_structure = """
    프로젝트 구조:
    - Framework: Next.js 14 (App Router)
    - Styling: Tailwind CSS
    - Language: TypeScript/JavaScript
    - Database: MongoDB
    - Auth: NextAuth.js

    주요 페이지:
    - 메인 페이지 (Home)
    - 정책 분석
    - 상담 요청
    - 사업자의 목소리
    - 전문가 서비스
    """

    # 현재 홈페이지 코드 읽기
    home_code = read_file('src/components/home/Home.js')

    context = f"""{project_structure}

현재 Home.js 일부:
{home_code[:1500] if home_code else '파일 없음'}
    """

    # Codex 호출
    response = call_codex(request, context)

    if not response:
        return None

    print("📝 Codex 응답 받음\n")
    print("=" * 50)
    print(response[:500] + "..." if len(response) > 500 else response)
    print("=" * 50 + "\n")

    # 코드 블록 추출 및 파일 생성
    code_blocks = extract_code_blocks(response)

    if code_blocks:
        print(f"📂 {len(code_blocks)}개의 코드 블록 발견\n")

        for i, block in enumerate(code_blocks, 1):
            if block['filename']:
                # 파일 경로 결정
                filename = block['filename']
                if not filename.startswith(('src/', 'public/', 'styles/')):
                    # 확장자에 따라 디렉토리 결정
                    if filename.endswith(('.tsx', '.ts', '.jsx', '.js')):
                        filename = f"src/components/{filename}"
                    elif filename.endswith('.css'):
                        filename = f"styles/{filename}"

                write_file(filename, block['code'])
            else:
                print(f"📄 코드 블록 {i} (파일명 미지정)")

    return response


def interactive_mode():
    """대화형 모드"""
    print("🤖 GPT-5-Codex 대화형 모드")
    print("종료하려면 'exit' 또는 'quit' 입력\n")

    while True:
        try:
            request = input("💬 요청사항: ").strip()

            if request.lower() in ['exit', 'quit', '종료']:
                print("👋 종료합니다.")
                break

            if not request:
                continue

            response = build_homepage(request)

            if response:
                print("\n✨ 작업 완료!\n")
            else:
                print("\n⚠️ 작업 실패. 다시 시도해주세요.\n")

        except KeyboardInterrupt:
            print("\n\n👋 종료합니다.")
            break


def main():
    """메인 함수"""
    args = sys.argv[1:]

    if not args:
        print("사용법:")
        print("  python codex_api.py \"요청 내용\"")
        print("  python codex_api.py --interactive")
        print("\n예시:")
        print('  python codex_api.py "메인 페이지에 애니메이션 효과 추가"')
        print('  python codex_api.py "반응형 네비게이션 메뉴 구현"')
        return

    if args[0] == '--interactive':
        interactive_mode()
    else:
        request = ' '.join(args)
        build_homepage(request)


if __name__ == "__main__":
    main()