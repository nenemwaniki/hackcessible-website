# Repository Workflow

This note captures the workflow we are using so the repo stays organised without forcing the feature work into a different layout.

## Branching
- Keep the long-lived branches stable.
- Do feature work on a topic branch that matches the change stream.
- For the current content and image pass, use `adjustments+images` as the review target.

## Commit Shape
- Keep code changes and documentation updates separate when practical.
- Use short, conventional commit messages like `feat:`, `fix:`, `docs:`, and `chore:`.
- Keep each commit focused on one behavior or one documentation outcome.

## Documentation Rules
- Use `README.md` for the public overview of the site.
- Use `Design/` for dated plans, implementation summaries, and workflow notes.
- Keep design notes descriptive and brief so they are easy to scan later.

## Pull Request Checklist
- Summarize the user-facing change.
- Note any pages, scripts, or styles that changed.
- Include preview or verification steps.
- Mention any local-only files or ignored folders that should stay out of version control.