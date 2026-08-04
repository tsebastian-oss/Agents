from __future__ import annotations

import base64
import io
from pathlib import Path
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_DIR = ROOT / "scripts" / "archive"

parts = sorted(ARCHIVE_DIR.glob("part-*.txt"))
if len(parts) != 7:
    raise SystemExit(f"Expected 7 archive parts, found {len(parts)}")

payload = "".join(part.read_text(encoding="utf-8").strip() for part in parts)
archive_bytes = base64.b64decode(payload, validate=True)

with ZipFile(io.BytesIO(archive_bytes)) as archive:
    for member in archive.infolist():
        target = (ROOT / member.filename).resolve()
        if ROOT not in target.parents and target != ROOT:
            raise SystemExit(f"Unsafe archive path: {member.filename}")
    archive.extractall(ROOT)

required = [
    ROOT / "package.json",
    ROOT / "src" / "app" / "page.tsx",
    ROOT / "src" / "proxy.ts",
    ROOT / "supabase" / "migrations" / "20260804143000_initial_schema.sql",
]
missing = [str(path.relative_to(ROOT)) for path in required if not path.exists()]
if missing:
    raise SystemExit(f"Bootstrap incomplete. Missing: {', '.join(missing)}")

print(f"Extracted {len(archive.namelist())} project files.")
