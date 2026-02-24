要获取 `PRODUCTHUNT_CLIENT_ID` 和 `PRODUCTHUNT_CLIENT_SECRET`，您需要在 [Product Hunt](https://www.producthunt.com/) 上创建一个开发者账户并注册您的应用。以下是具体的步骤：

### 步骤 1: 创建 Product Hunt 开发者账户
1. **访问 Product Hunt 官网**: [https://www.producthunt.com](https://www.producthunt.com)
2. **注册账户**: 如果您还没有账户，首先需要注册一个账户。点击右上角的 **Sign Up** 按钮，填写必要的个人信息并创建一个账户。
3. **登录账户**: 如果您已经有账户，直接登录。

### 步骤 2: 创建应用并获取 API 密钥
1. **访问开发者控制台**: 在 Product Hunt 网站登录后，点击右上角您的头像，选择 **API**，这将引导您到开发者控制台。
2. **注册一个新的应用**: 在 API 页面，点击 **Create new application** 按钮。
3. **填写应用信息**: 您需要提供一些信息，比如：
   - **应用名称**: 给您的应用起一个名字。
   - **应用描述**: 简短描述您的应用功能。
   - **网站 URL**: 您的应用的官方网站链接（如果有的话）。
   - **回调 URL**: 用于 OAuth 认证的回调地址。如果您使用的是 OAuth 2.0 认证，这个地址是必须提供的。

4. **保存应用信息**: 完成信息填写后，点击 **Create Application** 或类似按钮提交。

### 步骤 3: 获取 `CLIENT_ID` 和 `CLIENT_SECRET`
创建应用后，您将在控制台页面看到您的应用详情，其中包括：
- **CLIENT_ID**：这是您在 API 请求中使用的客户端 ID。
- **CLIENT_SECRET**：这是与 CLIENT_ID 配对使用的密钥，您在授权时需要提供。

### 步骤 4: 使用 CLIENT_ID 和 CLIENT_SECRET
1. **授权流程**：使用 OAuth 2.0 流程来获取访问 Product Hunt API 的权限。您需要在请求中提供 `CLIENT_ID` 和 `CLIENT_SECRET` 来完成授权。
2. **调用 API**：在获取授权令牌后，您就可以使用 Product Hunt 的 API 来访问所需的数据。

### 示例代码 (使用 Python 和 `requests` 库)
```python
import requests

CLIENT_ID = 'your_client_id'
CLIENT_SECRET = 'your_client_secret'
REDIRECT_URI = 'your_redirect_uri'
AUTHORIZATION_CODE = 'authorization_code_received'

# Step 1: 获取 Access Token
url = 'https://api.producthunt.com/v2/oauth/token'
data = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'redirect_uri': REDIRECT_URI,
    'code': AUTHORIZATION_CODE,
    'grant_type': 'authorization_code'
}

response = requests.post(url, data=data)
access_token = response.json().get('access_token')

# Step 2: 使用 Access Token 调用 API
headers = {'Authorization': f'Bearer {access_token}'}
api_url = 'https://api.producthunt.com/v2/api/graphql'
response = requests.get(api_url, headers=headers)

print(response.json())
```

这样，您就可以通过 `CLIENT_ID` 和 `CLIENT_SECRET` 获取访问令牌，并使用 API 进行进一步的操作。

如果您遇到任何问题或有进一步的疑问，可以参考 [Product Hunt API 文档](https://api.producthunt.com/v2/docs) 以获取更多信息。