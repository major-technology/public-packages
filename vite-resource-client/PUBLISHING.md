# Publishing Guide

## 🔨 Build

```bash
pnpm build
```

This will:
1. Clean the `dist/` folder
2. Compile TypeScript to ESM + types
3. Transpile ESM to CJS with esbuild

## 📦 Publish New Version

### First Time Setup
```bash
npm login
```

### Publish Steps

```bash
# 1. Update version
npm version patch  # 0.1.0 → 0.1.1 (bug fixes)
npm version minor  # 0.1.0 → 0.2.0 (new features)
npm version major  # 0.1.0 → 1.0.0 (breaking changes)

# 2. Build (happens automatically via prepublishOnly)
# pnpm build

# 3. Publish to npm
npm publish --access public

# 4. Push version bump
git push && git push --tags
```

### One-Liner
```bash
npm version patch && npm publish --access public && git push && git push --tags
```

## 🎯 Version Guidelines

- **Patch** (0.1.x): Bug fixes, typos, documentation
- **Minor** (0.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

## ✅ Verify Published

```bash
npm view @major-tech/resource-client
```

