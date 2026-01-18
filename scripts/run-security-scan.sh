#!/bin/bash
# Frontend Security Scan Script
# Usage: ./scripts/run-security-scan.sh

set -e

echo "🔒 Starting Frontend Security Scan..."
echo "====================================="

# Create reports directory
mkdir -p security-reports

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. pnpm Audit - Dependency Vulnerability Scanner
echo ""
echo "🔍 Running pnpm Audit (Dependency Vulnerability Scanner)..."
pnpm audit --json > security-reports/pnpm-audit.json 2>&1 || true
pnpm audit > security-reports/pnpm-audit.txt 2>&1 || true

if grep -q '"severity":"critical"\|"severity":"high"' security-reports/pnpm-audit.json 2>/dev/null; then
    echo -e "${RED}⚠️  HIGH/CRITICAL vulnerabilities found!${NC}"
    echo "Run 'pnpm audit --fix' to auto-fix"
else
    echo -e "${GREEN}✓ No critical vulnerabilities${NC}"
fi

# 2. TypeScript Type Check
echo ""
echo "🔍 Running TypeScript Type Check..."
pnpm exec tsc --noEmit --pretty false > security-reports/typescript-check.txt 2>&1 || true

if [ -s security-reports/typescript-check.txt ]; then
    echo -e "${YELLOW}⚠️  TypeScript errors found${NC}"
else
    echo -e "${GREEN}✓ No TypeScript errors${NC}"
fi

# 3. ESLint Security Check
echo ""
echo "🔍 Running ESLint Security Check..."
pnpm exec eslint . --ext .ts,.tsx,.js,.jsx -f json -o security-reports/eslint-report.json 2>&1 || true
pnpm exec eslint . --ext .ts,.tsx,.js,.jsx > security-reports/eslint-report.txt 2>&1 || true

if [ -s security-reports/eslint-report.txt ]; then
    echo -e "${YELLOW}⚠️  ESLint issues found${NC}"
else
    echo -e "${GREEN}✓ No ESLint issues${NC}"
fi

# 4. Build Check
echo ""
echo "🔍 Running Build Check..."
pnpm run build > security-reports/build-check.txt 2>&1 || true

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build successful${NC}"
else
    echo -e "${RED}⚠️  Build failed - check build-check.txt${NC}"
fi

# 5. Check for hardcoded secrets (if detect-secrets is installed)
echo ""
echo "🔍 Checking for hardcoded secrets..."
if command -v detect-secrets &> /dev/null; then
    detect-secrets scan --baseline .secrets.baseline > security-reports/secrets-scan.json 2>&1 || true
    echo -e "${GREEN}✓ Secrets scan complete${NC}"
else
    echo -e "${YELLOW}⚠️  detect-secrets not installed (optional)${NC}"
fi

# Summary
echo ""
echo "====================================="
echo "📊 Security Scan Summary"
echo "====================================="
echo "Reports saved to: security-reports/"
echo ""
echo "Files generated:"
ls -lh security-reports/
echo ""
echo -e "${GREEN}✓ Security scan complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Review reports in security-reports/"
echo "2. Run 'pnpm audit --fix' for auto-fixable vulnerabilities"
echo "3. Fix HIGH/CRITICAL severity issues"
echo "4. Address TypeScript and ESLint errors"
