# import os
# import requests
# import re

# from bs4 import BeautifulSoup

# from app.engine import OpenAIEngine

# engine = OpenAIEngine(os.environ.get("OPENAI_API_KEY"))

# urls = [
#     "https://ja.wikipedia.org/wiki/%E5%B1%B1%E6%A2%A8%E7%9C%8C"
# ]

# def extract_chapters(root, headings_tags=['h1', 'h2', 'h3']):
#     chapters = []
#     for child in root.descendants:
#         if child.name in headings_tags:
#             chapters.append({
#                 'title': child.text.strip(),
#                 'content': []
#             })
#             continue
        
#         if len(chapters) == 0:
#             continue
        
#         if isinstance(child, str):
#             chapters[-1]['content'].append(re.sub(r'[\r\n \t]+', ' ', child))

#     return chapters

# for url in urls:
#     # コンテンツを取得
#     try:
#         response = requests.get(url, timeout=10)
#         response.raise_for_status()
#     except Exception as e:
#         print(f"Failed to retrieve {url}: {e}")
#         continue
    
#     # ページ内容をパース
#     soup = BeautifulSoup(response.text, "html.parser")
#     chapters = extract_chapters(soup)

#     # 結果を表示
#     for chapter in chapters:
#         print(f"Title: {chapter['title']}")
#         print(f"Content: {''.join(chapter['content'])}\n")
    
#     # データベースに保存
#     for chapter in chapters:
#         engine.add_page(
#             '\n'.join(chapter['content']),
#             f"{url}#:~:text={chapter['title']}"
#         )
