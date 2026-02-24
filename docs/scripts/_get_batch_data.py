import requests
import json
import os
from datetime import datetime


API_URL = "https://google.serper.dev/search"
API_KEY = '6f1d6fca0d2853e2dac8f9b522cd286716480d19'

def print_links(json_data):
    for entry in json_data:
        if "organic" in entry:
            for item in entry["organic"]:
                print(item.get("link"))

def search_web(keyword, host):
    payload = json.dumps(
        [
            {
                "q": f"{keyword} inurl:{host}",
                "num": 100
            }
        ]
    )
    headers = {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json'
    }
    try:
        response = requests.post(API_URL, headers=headers, data=payload)
        response.raise_for_status()
        results = response.json()
        print_links(response.json())
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"搜索 '{keyword}' 时发生错误: {e}")
        return None

def save_results(keyword, host, results):
    if results:
        folder_name = f"{keyword}"
        os.makedirs(folder_name, exist_ok=True)
        file_name = f"{datetime.now().strftime('%Y-%m-%d')}.json"
        file_path = os.path.join(folder_name, file_name)
        try:
            with open(file_path, "w", encoding="utf-8") as file:
                content = json.dumps(results, indent=2, ensure_ascii=False)
                file.write(content)
            print(f"搜索结果已保存到 {file_path}")
        except IOError as e:
            print(f"保存搜索结果到 {file_path} 时发生错误: {e}")
    else:
        print("没有搜索结果可保存。")

def search_web_and_save(keyword, host):
    results = search_web(keyword, host)
    save_results(keyword, host, results)

def main():
    keyword = "GHSL"
    host = "https://securitylab.github.com/advisories/"
    # 使用 search_web_and_save 函数来搜索并保存结果
    search_web_and_save(keyword, host)

if __name__ == "__main__":
    main()