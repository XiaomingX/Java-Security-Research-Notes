# Whoogle-Search Vulnerabilities Overview

Whoogle-search has multiple vulnerabilities, including **Server-Side Request Forgery (SSRF)** and **Cross-Site Scripting (XSS)**. These issues are categorized as **CVE-2024-22203**, **CVE-2024-22204**, **CVE-2024-22205**, and **CVE-2024-22417**.

## Key Vulnerabilities

### 1. Server-Side Request Forgery (SSRF)
- **What is SSRF?**  
  SSRF allows an attacker to make requests from the server to internal or external resources that the server can access, even if those resources are not publicly available on the internet.

- **How does it occur?**  
  - In the `element` and `window` methods of `app/routes.py`, user inputs (`src_type`, `element_url`, and `location`) are not properly validated.
  - These inputs are sent to the `send` method, which executes GET requests (identified in `request.py`) using those inputs.

### 2. Cross-Site Scripting (XSS)
- **What is XSS?**  
  XSS vulnerabilities allow attackers to inject malicious scripts into web pages viewed by other users.

- **How does it occur?**  
  - The data returned from the SSRF requests is displayed back to the user without sanitization.
  - Attackers can craft a URL that points to a malicious site. When users click on this link, they believe it's from a trusted source, as the URL appears legitimate.
  
### 3. Limited File Write Vulnerability
- **What is it?**  
  This vulnerability lets an attacker write arbitrary data to files on the server, potentially leading to further exploitation.

- **How does it occur?**  
  - The function `config` in `app/routes.py` allows user input to manipulate file paths insecurely.
  - User data is saved to files without proper checks, and the application can be tricked into overwriting existing files.

## Summary

These vulnerabilities can lead to significant security risks, allowing attackers to:
- Access internal services not meant for public access (via SSRF).
- Execute malicious scripts in the user’s browser (via XSS).
- Write arbitrary data into server files (limited file write).

### Reporting

These issues were discovered by **Sylwia Budzynska** from the GHSL team. For more information, you can contact the GHSL team at **securitylab@github.com**, referencing the specific vulnerability codes.