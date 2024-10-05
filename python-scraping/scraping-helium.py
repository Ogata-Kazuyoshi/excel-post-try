import csv
import time
import re
from helium import start_chrome, click, kill_browser
from bs4 import BeautifulSoup

# 入力ファイルと出力ファイルのパス
input_file = 'license-checker.csv'
output_file = 'license-check-owner.csv'

# 訪問済みのリンクとその結果を記録する辞書
visited_links = {}

# 結果を格納するリスト
results = []

# CSVファイルを読み込む
with open(input_file, mode='r', encoding='utf-8') as file:
    reader = csv.reader(file)
    header = next(reader)  # ヘッダーを取得
    header.extend(['Copyright Info', 'Year', 'Details'])  # 新しい列を追加
    results.append(header)

    for row in reader:
        module_name, license_type, repository = row[:3]
        print("ここ回ってる")
        print(row)

        # MITライセンスのものだけ処理
        if license_type == 'MIT':
            if repository in visited_links:
                # 既に訪問済みのリンクの場合、結果を再利用
                row.extend(visited_links[repository])
            else:
                try:
                    # Chromeブラウザを起動して指定のURLにアクセス
                    browser = start_chrome(repository, headless=True)
                    time.sleep(1)  # アクセス間隔を2秒空ける

                    # "MIT License"というテキストを持つリンクをクリック
                    click('MIT License')

                    # ページのHTMLを取得
                    page_source = browser.page_source

                    # BeautifulSoupでHTMLを解析
                    soup = BeautifulSoup(page_source, 'html.parser')

                    # 'plain'クラスを持つ要素を取得
                    plain_element = soup.find(class_='plain')

                    # 最初の子要素のテキストを取得
                    if plain_element and plain_element.contents:
                        first_child_text = plain_element.get_text(strip=True)
                        # 各行を分割して、"Copyright"から始まる行を探す
                        lines = first_child_text.splitlines()
                        copyright_info = next((line for line in lines if re.match(r'^Copyright', line)), None)
                        if copyright_info:
                            # 発行年と詳細を抽出
                            year_match = re.search(r'(\d{4}(?:-present)?)', copyright_info)
                            if year_match:
                                year = year_match.group(1)
                                details = copyright_info.replace(year, '').strip()
                            else:
                                year = '発行年不明'
                                details = copyright_info.replace('Copyright', '').strip()

                            row.extend([copyright_info, year, details])
                            visited_links[repository] = [copyright_info, year, details]
                        else:
                            row.extend(['plainクラスの要素またはその子要素が見つかりませんでした。', '発行年不明', ''])
                            visited_links[repository] = ['plainクラスの要素またはその子要素が見つかりませんでした。', '発行年不明', '']
                    else:
                        row.extend(['plainクラスの要素またはその子要素が見つかりませんでした。', '発行年不明', ''])
                        visited_links[repository] = ['plainクラスの要素またはその子要素が見つかりませんでした。', '発行年不明', '']

                except Exception as e:
                    row.extend([f'エラー: {str(e)}', '発行年不明', ''])
                    visited_links[repository] = [f'エラー: {str(e)}', '発行年不明', '']

                finally:
                    # ブラウザを終了
                    kill_browser()

        else:
            row.extend(['', '', ''])

        # 結果を追加
        results.append(row)

# 新しいCSVファイルに結果を書き込む
with open(output_file, mode='w', encoding='utf-8', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(results)