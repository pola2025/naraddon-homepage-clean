from pathlib import Path

path = Path('src/components/PolicyNewsSection/PolicyNewsSection.js')
text = path.read_text(encoding='utf-8')
start_marker = "          <div className=\"policy-news-empty\">"
end_marker = "  return ("
start = text.find(start_marker)
if start == -1:
    raise SystemExit('start marker not found')
end = text.find(end_marker, start)
if end == -1:
    raise SystemExit('end marker not found')
replacement = "          <div className=\"policy-news-empty\">\r\n            <div className=\"policy-news__section-header policy-news__section-header--empty\">\r\n              <div className=\"policy-news__section-heading\">\r\n                <h2 className=\"policy-news__section-title\">\r\n                  <i className=\"fas fa-newspaper\"></i> 정책소식\r\n                </h2>\r\n                <p className=\"policy-news__section-subtitle\">최신 정책 동향을 등록해 정보를 공유해 주세요.</p>\r\n                <p className=\"policy-news__section-caption\">나라똔이 엄선한 정책 소식을 빠르게 업데이트합니다.</p>\r\n              </div>\r\n              <button className=\"policy-news__write-button\" onClick={handleWriteClick}>\r\n                <i className=\"fas fa-pen\"></i>\r\n                <span>정책소식 작성</span>\r\n              </button>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    );\r\n\r\n"
text = text[:start] + replacement + text[end:]
path.write_text(text, encoding='utf-8')
