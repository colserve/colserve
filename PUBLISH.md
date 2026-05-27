# Publishing ColServe Placeholders

This guide walks through publishing the `colserve` placeholder packages to PyPI and npm. Run each section once, in order. Estimated time: 10–15 minutes.

---

## A. Publish to PyPI

### 1. Get a PyPI API token

1. Create an account at https://pypi.org/account/register/ if you don't have one.
2. Enable 2FA (required for uploads).
3. Go to https://pypi.org/manage/account/token/ and create a new API token.
   - Scope: "Entire account" is fine for the first upload. After `colserve` exists on PyPI, you can recreate a token scoped to just that project.
4. Copy the token. It starts with `pypi-` and is shown only once.

### 2. Set up auth

Pick **one** of these two approaches.

**Option A — environment variables (simplest, no file to manage):**

```bash
export TWINE_USERNAME=__token__
export TWINE_PASSWORD=pypi-AgEN...your-token-here
```

The literal string `__token__` is the username for all token-based uploads. The actual token goes in the password.

**Option B — `~/.pypirc` (persists across shells):**

Create `~/.pypirc` with:

```ini
[pypi]
  username = __token__
  password = pypi-AgEN...your-token-here
```

Then `chmod 600 ~/.pypirc` so other users on the machine can't read it.

### 3. Build and upload

```bash
pip install --upgrade build twine
cd python
python -m build
twine upload dist/*
```

What to expect:

- `python -m build` creates `dist/colserve-0.0.1.tar.gz` and `dist/colserve-0.0.1-py3-none-any.whl`. Takes ~10 seconds.
- `twine upload dist/*` uploads both files. Output ends with a URL like `https://pypi.org/project/colserve/0.0.1/`.

If `twine` complains about the email field, it's because you haven't replaced `REPLACE_ME@example.com` in `pyproject.toml`. PyPI doesn't strictly require a real email, but it's good practice. Edit it, rebuild, and re-upload.

### 4. Verify

Open https://pypi.org/project/colserve/ in your browser. You should see the package listed with version 0.0.1 and the README rendered.

---

## B. Publish to npm

### 1. Create an npm account

Sign up at https://www.npmjs.com/signup if you don't have one. Enable 2FA at https://www.npmjs.com/settings/~/profile (required for publishing).

### 2. Log in from the terminal

```bash
npm login
```

This is interactive. It will prompt for:

- **Username** — your npm username (not email).
- **Password** — your npm password.
- **Email** — your account email (public on the registry).
- **OTP** — the 6-digit code from your 2FA app.

When done, `npm whoami` should print your username.

### 3. Publish

```bash
cd npm
npm publish --access public
```

The `--access public` flag is required for unscoped packages (`colserve` with no `@scope/` prefix) and is harmless to include even when not strictly needed.

What to expect:

- npm packs the directory contents (skips anything in `.gitignore` plus a few defaults like `node_modules`).
- Output ends with `+ colserve@0.0.1`.

### 4. Verify

Open https://www.npmjs.com/package/colserve in your browser. You should see version 0.0.1 listed with the README rendered.

---

## C. Critical warnings

- **Version 0.0.1 is gone forever once uploaded.** Neither PyPI nor npm will let you re-upload the same version, even if you delete it first. If you find a typo five minutes later, you have to bump to `0.0.2` (edit `version` in both `pyproject.toml` and `package.json`) and republish.
- **The name is reserved forever.** Once `colserve` is published, only you can publish updates to it. This is the whole point — but it also means there's no taking it back if you change the project name later. Pick the name you actually want.
- **PyPI deletions don't free the version number.** You can delete a release from the PyPI web UI, but the version slot stays burned. Same on npm.
- **Don't commit your tokens.** If you accidentally push `~/.pypirc` or an env var to git, revoke the token immediately at https://pypi.org/manage/account/token/.

---

## D. Post-publish smoke tests

Run these *after* both packages are live to confirm end-users will see the launch message.

### Python

```bash
python -m venv /tmp/colserve-test
source /tmp/colserve-test/bin/activate
pip install colserve
python -c "import colserve"
```

Expected output:

```
ColServe is launching soon. Visit https://colserve.dev to get early access.
```

Then `deactivate` and `rm -rf /tmp/colserve-test`.

### npm

```bash
mkdir /tmp/colserve-test && cd /tmp/colserve-test
npm init -y
npm install colserve
node -e "require('colserve')"
```

Expected output:

```
ColServe is launching soon. Visit https://colserve.dev to get early access.
```

Then `cd .. && rm -rf /tmp/colserve-test`.

---

## E. After publishing

- Add `colserve 0.0.1` to your project notes so you remember what's live.
- When the real library is ready, bump versions, rebuild, and re-upload using the same commands above.
