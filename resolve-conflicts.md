# How to resolve merge conflicts and update your PR

## Step 1 — update main locally

```bash
git checkout main
git pull origin main
```

---

## Step 2 — switch back to your branch and merge main into it

```bash
git checkout your-branch-name
git merge main
```

Git will tell you which files have conflicts.

---

## Step 3 — open VSCode and resolve conflicts

Open each conflicted file. VSCode highlights the conflicts like this:

```
<<<<<<< HEAD          ← your changes (div-and-focus-fix)
  your code here
=======
  code from main
>>>>>>> main
```

For each conflict:
- Click **Accept Current Change** to keep yours
- Click **Accept Incoming Change** to keep main's
- Click **Accept Both Changes** if you need both
- Or edit the result manually if neither option is right on its own

Go through every conflicted file until there are no `<<<<<<<` markers left.

---

## Step 4 — mark conflicts as resolved and complete the merge

```bash
git add .
git merge --continue
```

Git will open a commit message editor — you can keep the default message and save.
If you prefer to skip the editor, you can use `git commit -m "Merge main into div-and-focus-fix"` instead.

---

## Step 5 — push to your PR branch

```bash
git push origin your-branch-name
```

The PR on GitHub will update automatically — no need to open a new one.

---

## Tips

- If something goes wrong mid-merge and you want to start over, run:
  ```bash
  git merge --abort
  ```
- Do **not** delete or rename any file during conflict resolution —
  just edit the content inside the conflict markers.
- If a file shows as conflicted but you know one version is entirely correct,
  right-click it in VSCode's Source Control panel and pick
  **Accept All Current** or **Accept All Incoming**.
