from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

# Chromeのオプションを設定
chrome_options = Options()
chrome_options.add_argument("--headless")  # ヘッドレスモードで実行


# WebDriverをセットアップ
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

# URLを指定
url = "https://github.com/floating-ui/floating-ui?tab=MIT-1-ov-file"
driver.get(url)

# class名がplainのdivタグを探す
try:
    plain_div = driver.find_element(By.CLASS_NAME, 'plain')
    # 最初の子要素のテキストを取得
    first_child_text = plain_div.find_element(By.XPATH, './*').text
    print(f"First child text: {first_child_text}")
except Exception as e:
    print("class 'plain' のdivタグが見つかりませんでした。", e)

# ブラウザを閉じる
driver.quit()