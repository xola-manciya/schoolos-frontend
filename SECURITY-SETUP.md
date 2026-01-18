# Frontend Security Scanning Setup

## 🔒 Automated Security Scanning

This repository is configured with comprehensive security scanning for the React/TypeScript frontend.

## 📋 What's Included

### 1. Pre-commit Hooks
Runs before every `git commit` to catch security issues early.

**Tools:**
- **ESLint**: Security rules for React/TypeScript
- **TypeScript**: Type checking to prevent runtime errors
- **pnpm audit**: Checks dependencies for vulnerabilities
- **detect-secrets**: Prevents committing API keys/secrets

### 2. GitHub Actions (CI/CD)
Automated scans on every push, pull request, and weekly schedule.

**Workflows:**
- Security vulnerability scanning
- Dependency review
- CodeQL analysis
- Snyk scanning (optional)
- Automatic issue creation for critical vulnerabilities

### 3. Weekly Reports
Scheduled security scans every Monday at 9 AM UTC.

## 🚀 Setup Instructions

### Step 1: Install Dependencies

```bash
# Install dependencies
pnpm install

# Install pre-commit (if using Python approach)
pip install pre-commit
pre-commit install
```

### Step 2: Setup Git Hooks (Alternative to pre-commit)

If you prefer npm-based hooks, use Husky:

```bash
# Install Husky
pnpm add -D husky

# Initialize Husky
pnpm exec husky init

# Create pre-commit hook
echo "#!/bin/sh
pnpm run lint
pnpm audit --audit-level=moderate
pnpm exec tsc --noEmit" > .husky/pre-commit

chmod +x .husky/pre-commit
```

### Step 3: Install Security Tools

```bash
# Install detect-secrets (optional)
pip install detect-secrets

# Create initial secrets baseline
detect-secrets scan > .secrets.baseline
```

### Step 4: Configure ESLint Security Rules

Add to your `eslintrc` or `eslint.config.js`:

```javascript
{
  "extends": [
    "plugin:security/recommended",
    "plugin:react-hooks/recommended"
  ],
  "plugins": ["security"]
}
```

### Step 5: GitHub Secrets Configuration

Add these secrets to your GitHub repository:

1. **SNYK_TOKEN**: (Optional) Snyk API token for advanced scanning

### Step 6: Enable GitHub Security Features

1. Go to Settings → Security → Code security and analysis
2. Enable:
   - ✅ Dependency graph
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ CodeQL analysis
   - ✅ Secret scanning

## 🔍 Running Scans Manually

### Quick Scan
```bash
# Run linting
pnpm run lint

# Check for vulnerabilities
pnpm audit

# Type check
pnpm exec tsc --noEmit
```

### Full Security Scan
```bash
# Make script executable (first time only - Linux/Mac)
chmod +x scripts/run-security-scan.sh

# Run comprehensive scan
./scripts/run-security-scan.sh

# Windows (PowerShell)
bash scripts/run-security-scan.sh
```

This generates reports in `security-reports/`:
- `pnpm-audit.json` - Dependency vulnerabilities
- `eslint-report.json` - Code quality and security issues
- `typescript-check.txt` - Type errors
- `build-check.txt` - Build verification
- `secrets-scan.json` - Hardcoded secrets check

### Individual Tool Scans

```bash
# Dependency audit
pnpm audit

# Auto-fix vulnerabilities
pnpm audit --fix

# ESLint security check
pnpm exec eslint . --ext .ts,.tsx,.js,.jsx

# TypeScript check
pnpm exec tsc --noEmit

# Build check
pnpm run build
```

## 📊 Understanding Reports

### Severity Levels
- 🔴 **CRITICAL/HIGH**: Fix immediately - serious security risk
- 🟡 **MODERATE**: Fix soon - potential vulnerability
- 🟢 **LOW**: Fix when possible - best practices

### Common Issues

**Dependency Vulnerabilities:**
- Outdated packages with known CVEs
- Run `pnpm audit --fix` or manually update

**ESLint Security Issues:**
- `react/no-danger`: Using dangerouslySetInnerHTML (XSS risk)
- `security/detect-object-injection`: Potential code injection
- `security/detect-eval-with-expression`: Using eval()

**TypeScript Issues:**
- Type errors that could cause runtime bugs
- Missing null checks
- Any types (bypassing type safety)

## 🛠️ Fixing Vulnerabilities

### Auto-fix Dependencies
```bash
# Fix all auto-fixable vulnerabilities
pnpm audit --fix

# Update specific package
pnpm update <package-name>

# Update all packages (be careful!)
pnpm update --latest
```

### Manual Fixes
1. Review the security report
2. Check if breaking changes exist
3. Update the package version
4. Test thoroughly
5. Commit and re-scan

### Environment Variables
Always use environment variables for sensitive data:

```typescript
// ✅ Good
const apiUrl = import.meta.env.VITE_API_BASE_URL

// ❌ Bad
const apiKey = "sk_live_abc123xyz"
```

## 🚨 CI/CD Behavior

### On Pull Requests
- ✅ Runs all security scans
- ✅ Fails PR if CRITICAL vulnerabilities found
- ✅ Posts review comments
- ✅ Blocks merge if build fails

### On Push to Main
- ✅ Runs all security scans
- ✅ Creates GitHub issue for critical vulnerabilities
- ✅ Uploads security reports as artifacts

### Weekly Schedule
- ✅ Comprehensive security audit
- ✅ Checks for new vulnerabilities in dependencies
- ✅ Creates issues for new findings

## 📧 Notifications

You'll receive notifications for:
- Critical vulnerabilities in dependencies
- Failed security scans
- New Dependabot alerts
- Pull request check failures

## 🔧 Configuration Files

- `.pre-commit-config.yaml` - Pre-commit hook configuration
- `.github/workflows/security-scan.yml` - GitHub Actions workflow
- `.secrets.baseline` - Known secrets (false positives)
- `eslint.config.js` or `.eslintrc` - ESLint configuration
- `tsconfig.json` - TypeScript configuration

## 📚 Additional Resources

- [pnpm Audit](https://pnpm.io/cli/audit)
- [Snyk](https://snyk.io/)
- [ESLint Security Plugin](https://github.com/eslint-community/eslint-plugin-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## 🆘 Troubleshooting

### Pre-commit hook fails
```bash
# Skip hooks temporarily (NOT RECOMMENDED)
git commit --no-verify

# Fix issues first
pnpm run lint --fix
pnpm audit --fix
```

### False positives in audit
```bash
# Override specific vulnerabilities (use cautiously)
pnpm audit --audit-level=high
```

### CI/CD failures
- Check GitHub Actions logs
- Verify all dependencies are installed
- Ensure pnpm-lock.yaml is committed
- Check for TypeScript errors locally first

### Build failures
```bash
# Clear cache
rm -rf node_modules .next dist

# Reinstall
pnpm install

# Rebuild
pnpm run build
```

## 🔐 Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Keep dependencies updated** - Run `pnpm update` regularly
3. **Review dependency changes** - Check changelogs before updating
4. **Use TypeScript strictly** - Avoid `any` types
5. **Sanitize user input** - Prevent XSS attacks
6. **Use HTTPS only** - For all API calls
7. **Implement CSP** - Content Security Policy headers
8. **Regular security audits** - Don't rely only on automation

## 📞 Support

For security concerns, contact: **security@schoolos.co.za**

Report vulnerabilities: **security@schoolos.co.za** (encrypted with our PGP key)
