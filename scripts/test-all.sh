#!/usr/bin/env bash
set -euo pipefail
echo '== FiveSamath frontend install =='
npm ci
echo '== FiveSamath frontend build =='
npm run build
echo '== FiveSamath frontend lint =='
npm run lint
echo 'Frontend verification completed.'
