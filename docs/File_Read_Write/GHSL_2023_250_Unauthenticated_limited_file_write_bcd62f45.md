# GHSL-2023-250: Unauthenticated limited file write in DocsGPT - CVE-2024-31451

DocsGPT is vulnerable to unauthenticated limited file write.

DocsGPT

v0.5.0

The check_docs endpoint concatenates user-controlled POST data with a URL, which allows for traversing the URL and changing the repository the files are downloaded from. The files are then saved on the server on lines as shown on line 214 and 219.

The vulnerability was found with the help of CodeQL.

This issue may lead to limited file write.

This issue was discovered and reported by GHSL team member @sylwia-budzynska (Sylwia Budzynska).

You can contact the GHSL team at securitylab@github.com, please include a reference to GHSL-2023-250 in any communication regarding this issue.

