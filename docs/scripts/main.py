from _read_website import getdata
from _convert_content_with_openai import convert_with_openai
from _vuln_category_creator import create_folder, get_category

import os
import hashlib

def save_to_file(content, folder_name):
    # 取第一行作为文件名基础
    title = content.splitlines()[0].replace("#", "").strip()
    # 截取标题，保留前50个字符，确保文件名不超过系统限制
    truncated_title = title[:50].strip()
    # 将标题转为有效文件名格式，去除特殊字符并用单个下划线替换空格
    safe_title = "".join(c if c.isalnum() else " " for c in truncated_title).strip()
    safe_title = "_".join(safe_title.split())  # 用单个下划线替换空格，不生成多余下划线

    # 生成唯一哈希，以确保文件名不重复
    unique_hash = hashlib.md5(title.encode()).hexdigest()[:8]
    filename = f"{safe_title}_{unique_hash}.md"

    # 设置完整路径
    file_path = os.path.join(folder_name, filename)

    try:
        with open(file_path, "w", encoding="utf-8") as file:
            file.write(content)
        print(f"内容已保存至 {file_path}")
    except OSError as e:
        print(f"保存文件失败：{e}")



def load_processed_urls(filename="processed_urls.txt"):
    try:
        with open(filename, "r") as file:
            return set(line.strip() for line in file)
    except FileNotFoundError:
        return set()

def save_processed_url(url, filename="processed_urls.txt"):
    with open(filename, "a") as file:
        file.write(url + "\n")

def main():
    processed_urls = load_processed_urls()
    urls = [
            "https://securitylab.github.com/advisories/GHSL-2024-297_GHSL-2024-298_plenti/",
            "https://securitylab.github.com/advisories/GHSL-2023-232_GHSL-2023-234_Flowise/",
            "https://securitylab.github.com/advisories/GHSL-2024-011_smartup/",
            "https://securitylab.github.com/advisories/GHSL-2023-136_Samson/",
            "https://securitylab.github.com/advisories/GHSL-2023-220_Alist/",
            "https://securitylab.github.com/advisories/GHSL-2024-127_GHSL-2024-129_OpenC3_COSMOS/",
            "https://securitylab.github.com/advisories/GHSL-2023-238_GHSL-2023-244_ngrinder/",
            "https://securitylab.github.com/advisories/GHSL-2024-167_monkeytype/",
            "https://securitylab.github.com/advisories/GHSL-2023-250_DocsGPT/",
            "https://securitylab.github.com/advisories/GHSL-2024-090_yt-dlp/",
            "https://securitylab.github.com/advisories/GHSL-2024-045_GHSL-2024-047_fishaudio_Bert-VITS2/",
            "https://securitylab.github.com/advisories/GHSL-2023-154_GHSL-2023-156_memos/",
            "https://securitylab.github.com/advisories/GHSL-2024-019_GHSL-2024-024_kohya_ss/",
            "https://securitylab.github.com/advisories/GHSL-2023-253_openrasp/",
            "https://securitylab.github.com/advisories/GHSL-2023-277_Owncast/",
            "https://securitylab.github.com/advisories/GHSL-2022-085_pac4j/",
            "https://securitylab.github.com/advisories/GHSL-2024-013_GHSL-2024-014_Meshery/",
            "https://securitylab.github.com/advisories/GHSL-2023-249_Meshery/",
            "https://securitylab.github.com/advisories/GHSL-2023-186_GHSL-2023-189_benbusby_whoogle-search/",
            "https://securitylab.github.com/advisories/GHSL-2023-190_Frigate/",
            "https://securitylab.github.com/advisories/GHSL-2023-225_GHSL-2023-226_Mealie/",
            "https://securitylab.github.com/advisories/GHSL-2023-235_GHSL-2023-237_Open_Metadata/",
            "https://securitylab.github.com/advisories/GHSL-2023-192_GHSL-2023-194_bazarr/",
            "https://securitylab.github.com/advisories/GHSL-2024-027_GHSL-2024-028_codeium-chrome/",
            "https://securitylab.github.com/advisories/GHSL-2023-092_Notepad__/",
            "https://securitylab.github.com/advisories/GHSL-2023-185_posthog_posthog/",
            "https://securitylab.github.com/advisories/GHSL-2022-018_Apache_Commons_Text/",
            "https://securitylab.github.com/advisories/GHSL-2023-121_go-saml__archived_/",
            "https://securitylab.github.com/advisories/GHSL-2023-028_jellyfin/",
            "https://securitylab.github.com/advisories/GHSL-2023-145_GHSL-2023-151_stb_image_h/",
            "https://securitylab.github.com/advisories/GHSL-2023-203_GHSL-2023-204_audiobookshelf/",
            "https://securitylab.github.com/advisories/GHSL-2022-100_Autolab/",
            "https://securitylab.github.com/advisories/GHSL-2023-004_act/",
            "https://securitylab.github.com/advisories/GHSL-2022-094_discordrb/",
            "https://securitylab.github.com/advisories/GHSL-2023-139_accountsservice/",
            "https://securitylab.github.com/advisories/GHSL-2022-054_Arm_Mali/",
            "https://securitylab.github.com/advisories/GHSL-2022-028_codex-team_editor_js/",
            "https://securitylab.github.com/advisories/GHSL-2023-218_GHSL-2023-219_scrypted/",
            "https://securitylab.github.com/advisories/GHSL-2023-081_GHSL-2023-082_Autolab/",
            "https://securitylab.github.com/advisories/GHSL-2021-1044_iziModal/",
            "https://securitylab.github.com/advisories/GHSL-2021-104-countly-server/",
            "https://securitylab.github.com/advisories/GHSL-2021-1012-keypair/",
            "https://securitylab.github.com/advisories/GHSL-2022-048_Jsonxx/",
            "https://securitylab.github.com/advisories/GHSL-2022-138_lorawan-stack/",
            "https://securitylab.github.com/advisories/GHSL-2022-119_CasaOS/",
            "https://securitylab.github.com/advisories/GHSL-2021-020-pillarjs-hbs/",
            "https://securitylab.github.com/advisories/GHSL-2022-061_ghinstallation/",
            "https://securitylab.github.com/advisories/GHSL-2020-258-zipslip-bblfshd/",
            "https://securitylab.github.com/advisories/GHSL-2020-075-libsane/",
            "https://securitylab.github.com/advisories/GHSL-2021-103-erxes/",
            "https://securitylab.github.com/advisories/GHSL-2021-066-totaljs-totaljs/",
            "https://securitylab.github.com/advisories/GHSL-2021-1042_Baremetrics_Date_Range_Picker/",
            "https://securitylab.github.com/advisories/GHSL-2022-009_ckeditor4/",
            "https://securitylab.github.com/advisories/GHSL-2021-054_057-moby-hyperkit/",
            "https://securitylab.github.com/advisories/GHSL-2020-096-tweetstream-tweetstream/",
            "https://securitylab.github.com/advisories/GHSL-2021-061-diez-generation-cmd-injection/",
            "https://securitylab.github.com/advisories/GHSL-2021-1010-Alpine/",
            "https://securitylab.github.com/advisories/GHSL-2021-1047_Mind-elixir/",
            "https://securitylab.github.com/advisories/GHSL-2020-235-wayou-turn-issues-to-posts-action/",
            "https://securitylab.github.com/advisories/GHSL-2022-008_The_OWASP_Enterprise_Security_API/",
            "https://securitylab.github.com/advisories/GHSL-2020-254-zipslip-dotmesh/",
            "https://securitylab.github.com/advisories/GHSL-2022-031_GHSL-2022-032_Nokogiri/",
            "https://securitylab.github.com/advisories/GHSL-2024-096_homepage/",
            "https://securitylab.github.com/advisories/GHSL-2021-058-moby-hyperkit/",
            "https://securitylab.github.com/advisories/GHSL-2023-229_GHSL-2023-230_kafka-ui/",
            "https://securitylab.github.com/advisories/GHSL-2023-205_GHSL-2023-207_go2rtc/",
            "https://securitylab.github.com/advisories/GHSL-2024-100_GHSL-2024-108_streamlit-geospatial/",
            "https://securitylab.github.com/advisories/GHSL-2024-089_youtube-dl/",
            "https://securitylab.github.com/advisories/GHSL-2024-030_dotnet_docfx/",
            "https://securitylab.github.com/advisories/GHSL-2024-029_Zammad/",
            "https://securitylab.github.com/advisories/GHSL-2021-118-zulip-zulip/",
            "https://securitylab.github.com/advisories/GHSL-2020-305-redos-Pure-JavaScript-HTML5-Parser/",
            "https://securitylab.github.com/advisories/GHSL-2024-069_ngrinder/",
            "https://securitylab.github.com/advisories/GHSL-2024-070_Chromium/",
            "https://securitylab.github.com/advisories/GHSL-2024-001_GHSL-2024-003_rubygems_org/",
            "https://securitylab.github.com/advisories/GHSL-2023-257_makeplane_plane/",
            "https://securitylab.github.com/advisories/GHSL-2023-261_Owncast/",
            "https://securitylab.github.com/advisories/GHSL-2024-145_Discord_js/",
            "https://securitylab.github.com/advisories/GHSL-2020-029-apache-syncope/",
            "https://securitylab.github.com/advisories/GHSL-2024-051_Misskey/",
            "https://securitylab.github.com/advisories/GHSL-2020-142-gemini-png-img/",
            "https://securitylab.github.com/advisories/GHSL-2023-009_Apereo_CAS/",
            "https://securitylab.github.com/advisories/GHSL-2024-025_GHSL-2024-026_AutoGen/",
            "https://securitylab.github.com/advisories/GHSL-2024-071_Chromium/",
            "https://securitylab.github.com/advisories/GHSL-2020-131-mongo-express/",
            "https://securitylab.github.com/advisories/GHSL-2024-040_typebot_io/",
            "https://securitylab.github.com/advisories/GHSL-2024-037_BioDrop/",
            "https://securitylab.github.com/advisories/GHSL-2020-228-YMFE-yapi/",
            "https://securitylab.github.com/advisories/GHSL-2024-044_Simple_Icons/",
            "https://securitylab.github.com/advisories/GHSL-2024-033_open-webui/",
            "https://securitylab.github.com/advisories/GHSL-2024-016_NuGetGallery/",
            "https://securitylab.github.com/advisories/GHSL-2024-010_stable-diffusion-webui/",
            "https://securitylab.github.com/advisories/GHSL-2023-224_Arm_Mali/",
            "https://securitylab.github.com/advisories/GHSL-2020-109-codecov/",
            "https://securitylab.github.com/advisories/GHSL-2023-221_digdag/",
            "https://securitylab.github.com/advisories/GHSL-2024-015_livemarks/",
            "https://securitylab.github.com/advisories/GHSL-2020-028-netflix-titus/",
            "https://securitylab.github.com/advisories/GHSL-2020-295-redos-is.js/",
            "https://securitylab.github.com/advisories/GHSL-2024-041_GHSL-2024-042_KubeBlocks/",
    ]


    for item in urls:
        if item in processed_urls:
            print(f"Skipping {item}, already processed.")
            continue

        content = getdata(item)
        processed_content=convert_with_openai(content)
        folder_name = get_category(processed_content)

        # 创建文件夹（如果不存在）
        if not os.path.exists(folder_name):
            os.makedirs(folder_name)

        save_to_file(processed_content, folder_name)
        save_processed_url(folder_name + "/" + item)
        print(f"Processed and saved {item}")

if __name__ == "__main__":
    main()
