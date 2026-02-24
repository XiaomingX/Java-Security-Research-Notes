import requests
from bs4 import BeautifulSoup

def getdata(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # 解析HTML内容
        soup = BeautifulSoup(response.text, "html.parser")
        
        # 提取标题和正文内容
        title = soup.find("h1").get_text() if soup.find("h1") else "No Title Found"
        paragraphs = soup.find_all("p")
        
        # 构建Markdown格式内容
        markdown_content = f"# {title}\n\n"
        for paragraph in paragraphs:
            markdown_content += f"{paragraph.get_text()}\n\n"

        return markdown_content  # 返回Markdown格式内容
    except requests.exceptions.RequestException as e:
        return f"An error occurred: {e}"

# 调用 getdata 函数并输出结果
if __name__ == "__main__":
    url = "https://securitylab.github.com/advisories/GHSL-2024-255_docker-mailserver/"
    content = getdata(url)
    print(content)
