## AWS S3 存储桶安全：被遗弃的“宝藏”与供应链攻击风险

最近，安全研究人员发现了一个 AWS S3 存储桶的安全问题，可能会被黑客利用来进行大规模的软件供应链攻击[1]。简单来说，就是一些公司或组织不再使用的 S3 存储桶，如果被攻击者重新注册，可能会被用来传播恶意软件，影响范围可能比之前的 SolarWinds 事件还要大[1]。

### 技术知识点

1.  **AWS S3 存储桶**：可以理解为云上的一个存储空间，用来存放各种文件和数据[1]。
2.  **存储桶名称的唯一性**：在 AWS 中，每个 S3 存储桶的名称都是全局唯一的，就像一个人的身份证号码一样[1]。如果一个存储桶被删除，它的名称就可以被其他人重新使用。
3.  **软件供应链攻击**：攻击者通过篡改软件的开发、构建、分发等环节，将恶意代码注入到软件中，从而影响所有使用该软件的用户。

### 实际应用例子

假设一家公司之前使用名为 `example-software-updates` 的 S3 存储桶来分发软件更新。后来，该公司停止使用该存储桶并将其删除。但是，一些用户或系统仍然配置为从 `example-software-updates` 下载更新。

这时，攻击者可以重新注册 `example-software-updates` 存储桶，并在其中放置恶意软件。当用户或系统尝试下载更新时，就会下载到恶意软件，从而导致系统被感染或数据泄露。

### Demo 代码

以下是一个简单的 Python 脚本，用于模拟从 S3 存储桶下载文件的过程：

```python
import boto3

# S3 存储桶名称
bucket_name = 'example-software-updates'
# 文件名
file_name = 'update.exe'
# 本地保存路径
local_path = '/tmp/update.exe'

# 创建 S3 客户端
s3 = boto3.client('s3')

try:
    # 下载文件
    s3.download_file(bucket_name, file_name, local_path)
    print(f'文件 {file_name} 下载成功，保存到 {local_path}')
except Exception as e:
    print(f'下载文件失败：{e}')
```

如果攻击者控制了 `example-software-updates` 存储桶，他们就可以替换 `update.exe` 文件，从而传播恶意软件。

### 如何防范

1.  **定期审计云资源**：检查是否有不再使用的 S3 存储桶或其他云资源，及时清理[5]。
2.  **严格的访问控制**：确保只有授权的用户才能访问 S3 存储桶，避免公开访问[1][2][5].
3.  **启用多因素认证（MFA）删除**：对于重要的存储桶，启用 MFA 删除功能，防止恶意删除[5]。
4.  **加密数据**：对存储在 S3 存储桶中的数据进行加密，防止数据泄露[1][5][8]。
5.  **使用对象锁定**：使用 S3 对象锁定功能，防止数据被覆盖或删除[5]。
6.  **启用版本控制**：启用 S3 版本控制功能，可以保存对象的多个版本，方便恢复[2][5]。
7.  **软件更新签名验证**：对于软件更新，使用数字签名进行验证，确保更新的真实性和完整性。
8.  **教育开发者**：加强开发人员的安全意识培训，提高安全编码能力。

### 总结

被遗弃的 AWS S3 存储桶可能成为供应链攻击的突破口。企业和开发者应该重视云安全，采取有效的措施来保护云资源，避免造成损失。

Citations:
[1] https://www.checkpoint.com/tw/cyber-hub/cloud-security/what-is-aws-security/s3-bucket-security/top-3-s3-bucket-security-issues/
[2] https://cloudsecurityalliance.org/blog/2024/06/10/aws-s3-bucket-security-the-top-cspm-practices
[3] https://blog.csdn.net/Julialove102123/article/details/141336646
[4] https://www.imooc.com/article/358061
[5] https://sonraisecurity.com/blog/aws-s3-best-practice/
[6] http://www.360doc.com/content/24/0831/21/20960430_1132815675.shtml
[7] https://pigsty.cc/zh/blog/cloud/s3-scam/
[8] https://www.sentinelone.com/cybersecurity-101/cybersecurity/s3-bucket-security/
[9] https://docs.aws.amazon.com/zh_cn/AmazonS3/latest/userguide/security-best-practices.html