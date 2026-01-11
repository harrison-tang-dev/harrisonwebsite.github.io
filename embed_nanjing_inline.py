#!/usr/bin/env python3
from pathlib import Path
b64_path = Path('Nanjing.b64')
if not b64_path.exists():
    print('Nanjing.b64 not found in workspace')
    raise SystemExit(1)

b64 = b64_path.read_text()
data_uri = 'data:image/png;base64,' + b64

files = ["Harrison Tang Portfolio (2).html", "<!DOCTYPE html>.html"]
for f in files:
    p = Path(f)
    if not p.exists():
        print(f"{f} not found, skipping")
        continue
    s = p.read_text()
    old = 'src="Nanjing University of Information Science and Technology.png"'
    if old in s:
        s = s.replace(old, 'src="' + data_uri + '"')
        p.write_text(s)
        print(f"Inlined image into {f}")
    else:
        print(f"Pattern not found in {f}, no change")
