from pathlib import Path
import re

path = Path('src/components/PolicyNewsSection/PolicyNewsSection.js')
text = path.read_text(encoding='utf-8')

start_marker = '            <div className="policy-news__section-header policy-news__section-header--empty">'
end_marker = '            </div>\n          </div>\n        </div>'
start_index = text.find(start_marker)
if start_index == -1:
    raise SystemExit('start marker not found')

end_index = text.find('            </div>\n          </div>\n        </div>', start_index)
if end_index == -1:
    raise SystemExit('end marker not found')
end_index += len('            </div>\n          </div>\n        </div>') - len('          </div>\n        </div>')
# Need to capture header block only (avoid closing wrappers)
header_end = text.find('            </div>\n          </div>\n        </div>', start_index)
if header_end == -1:
    raise SystemExit('header end not found')
header_end = text.find('          </div>', start_index)

# Instead, locate the closing tag for the header div before the empty container closes
header_close = text.find('            </div>\n          </div>\n        </div>', start_index)
if header_close == -1:
    raise SystemExit('header close not found')

# We need to find the specific closing tag of the header div
header_block_end = text.find('            </div>\n          </div>\n        </div>', start_index)

# To avoid complexity, use regex to match the header block directly
pattern = re.compile(r"\s{12}<div className=\"policy-news__section-header policy-news__section-header--empty\">.*?\s{12}</div>", re.S)
match = pattern.search(text)
if not match:
    raise SystemExit('header block regex not found')
block = match.group(0)

title_match = re.search(r'<i className=\"fas fa-newspaper\"></i>\s*(.*)', block)
subtitle_match = re.search(r'<p className=\"policy-news__section-subtitle\">(.*)</p>', block)
caption_match = re.search(r'<p className=\"policy-news__section-caption\">(.*)</p>', block)
if not (title_match and subtitle_match and caption_match):
    raise SystemExit('failed to capture text segments')

title_text = title_match.group(1).strip()
subtitle_text = subtitle_match.group(1).strip()
caption_text = caption_match.group(1).strip()

new_block = (
    "            <div className=\"policy-news__section-header policy-news__section-header--empty\">\n"
    "              <div className=\"policy-news__section-heading\">\n"
    "                <h2 className=\"policy-news__section-title\">\n"
    f"                  <i className=\"fas fa-newspaper\"></i> {title_text}\n"
    "                </h2>\n"
    f"                <p className=\"policy-news__section-subtitle\">{subtitle_text}</p>\n"
    f"                <p className=\"policy-news__section-caption\">{caption_text}</p>\n"
    "              </div>\n"
    "              <button className=\"policy-news__write-button\" onClick={handleWriteClick}>\n"
    "                <i className=\"fas fa-pen\"></i>\n"
    "                <span>정책소식 작성</span>\n"
    "              </button>\n"
    "            </div>"
)

text = text[:match.start()] + new_block + text[match.end():]

path.write_text(text, encoding='utf-8')
