# Whoogle-Search Vulnerabilities: SSRF and XSS

**Whoogle-Search** is a web application that has multiple security vulnerabilities, including:

1. **Server-Side Request Forgery (SSRF)**
2. **Cross-Site Scripting (XSS)**
3. **Limited File Write Vulnerability**

## Vulnerabilities Explained

### 1. Server-Side Request Forgery (SSRF)

- **Problem**: The application does not check user input for certain variables (`src_type` and `element_url`). This allows attackers to send GET requests to both internal and external resources through the server. 
- **Impact**: Attackers can access internal network resources that are not publicly available.

### 2. Cross-Site Scripting (XSS)

- **Problem**: The application reflects user-supplied data back to the web page without proper validation. This happens when the user controls input variables used in URLs.
- **Impact**: An attacker can create a malicious URL leading to a site designed to steal user credentials by tricking users into clicking on it.

### 3. Limited File Write

- **Problem**: The application does not properly validate user input when saving configuration files. This can allow attackers to manipulate file paths.
- **Impact**: Attackers can save or overwrite files on the server with arbitrary data due to poor input validation.

## Code Locations

- The vulnerabilities are found in the files:
  - `app/routes.py`: Handles user inputs and routing.
  - `requests.py`: Manages GET requests.

## Responsible Disclosure

These vulnerabilities were discovered by **Sylwia Budzynska** from the GHSL team and reported for resolution.

For any inquiries regarding these issues, please contact the GHSL team at `securitylab@github.com` with references to the vulnerability IDs (GHSL-2023-186, GHSL-2023-187, GHSL-2023-188, or GHSL-2023-189).