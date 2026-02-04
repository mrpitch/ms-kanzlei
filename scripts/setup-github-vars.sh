#!/usr/bin/env bash
# Setup GitHub repository variables for CDK deployment
# Run: ./scripts/setup-github-vars.sh

set -euo pipefail

# Project defaults — edit these or use .env.cdk values
DOMAIN_NAME="mskanzlei.mrpitch.rocks"
HOSTED_ZONE_ID="Z101967436NINE8V1MY7N"
AWS_REGION_CERT="us-east-1"
AWS_REGION_MAIN="eu-central-1"
DEPLOY_ROLE_NAME="ms-kanzlei-github-deploy"
DEPLOY_REPO_REF="repo:mrpitch/ms-kanzlei:ref:refs/heads/main"

echo "Setting GitHub repository variables..."

gh variable set DOMAIN_NAME --body "$DOMAIN_NAME"
gh variable set HOSTED_ZONE_ID --body "$HOSTED_ZONE_ID"
gh variable set AWS_REGION_CERT --body "$AWS_REGION_CERT"
gh variable set AWS_REGION_MAIN --body "$AWS_REGION_MAIN"
gh variable set DEPLOY_ROLE_NAME --body "$DEPLOY_ROLE_NAME"
gh variable set DEPLOY_REPO_REF --body "$DEPLOY_REPO_REF"

echo "Done. Verify with: gh variable list"
