from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()

def create_folder(folder_name):
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)
        print(f"Folder '{folder_name}' created.")
    else:
        print(f"Folder '{folder_name}' already exists.")

def get_category(data):
    client = OpenAI()
    question = f"""请判断以下内容属于哪一种漏洞类型，并从以下范围内选出最匹配的一个类型，以项目列表的形式输出该类型。仅需输出1个可能导致的最严重的漏洞的类型，不需添加其他说明。
范围：SSRF, CSRF, DoS, XSS, RCE, UAF, 开放重定向漏洞, 缓冲区溢出, SQL注入, 任意文件读写漏洞, 正则表达式拒绝服务, 信息泄露, 反序列化漏洞, 其他。
-----------
{data}
    """
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": question}
        ]
    )

    content = completion.choices[0].message.content
    content = content.replace("-","").strip()
    create_folder(content)
    print(content)
    return(content)
    

def main():
    mmdata = """# GHSL-2024-297_GHSL-2024-298: Plenti的远程代码执行漏洞 - CVE-2024-49380, CVE-2024-49381

## 概述
Plenti 是一个用于创建网站本地服务器的命令行工具。它存在一些安全漏洞，可能导致远程代码执行和文件丢失。

## 漏洞详情
- **版本**: Plenti v0.7.1
- **受影响的接口**: `/postLocal`

### 漏洞类型
1. **任意文件写入漏洞**  
   当用户使用 Plenti 服务他们的网站时，攻击者能够在服务器上写入任意文件。这可能导致远程代码执行。
   
2. **任意文件删除漏洞**  
   用户同样会遇到任意文件删除问题，导致信息丢失。

## 报告与联系
这些问题由 GHSL 团队成员 Kevin Stubbings (@Kwstubbs) 发现并报告。如果你有任何问题，请联系 GHSL 团队，邮箱为: securitylab@github.com，在沟通中请提及 GHSL-2024-297 或 GHSL-2024-298。
    """

    get_category(mmdata)


if __name__ == "__main__":
    main()
