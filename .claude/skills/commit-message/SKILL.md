---
name: commit-message
description: Write a commit message for the current changes in this repo and create the commit. Use when the user asks to commit, save, or write a commit message. Never adds a Co-Authored-By trailer or any AI attribution unless the user names someone to credit.
---

# Commit message

Use this only when the user asks for a commit. Never push.

## Steps

1. Run `git status --short` and `git diff --stat` (plus `git diff --cached` if anything is staged). Read enough of the diff to describe what changed and why.
2. Check the branch with `git branch --show-current`. If it's the default branch (`master`), commit there only when the user has asked for it.
3. Write the subject in this repo's style: `type(scope): short summary`, lowercase, imperative, under 72 characters.
    - Types seen here: `feat`, `fix`, `chore`, `clean-up`.
    - Scope is the app or package, such as `ecoop-app`, when the change is limited to one.
4. Add a body only when it helps. Use short `-` bullets for the notable changes. Skip the body for one-line changes.
5. Stage only the files that belong to this change. Don't stage build output, `node_modules`, or `.env` files.
6. Commit with a heredoc, so the message keeps its line breaks:

    ```bash
    git commit -q -F - <<'EOF'
    feat(ecoop-app): short summary

    - notable change
    EOF
    ```

7. Show the result with `git log --oneline -1` and `git status --short`.

## Rules

- **No `Co-Authored-By` trailer.** Don't add one for Claude, the model, or any AI. Don't add one for a person either, unless the user names that person in this request.
- **No "Generated with" lines or other attribution.** The commit message describes the change only.
- **Don't push, amend, or rewrite history** unless the user asks for that exact action.
- If the user does ask for a co-author, use exactly the name and email they give, and nothing else.
