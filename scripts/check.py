#!/usr/bin/env python3
"""Pre-deploy check for the Harbour Jackpot static site (no dependencies; Python 3.8+).

Usage:  python3 scripts/check.py      (exit code 1 if an error is found)

Checks
  1. data.json is valid JSON and has every top-level block the page renders.
  2. Every asset referenced by index.html, css/main.css and js/main.js exists
     (including the numbered images the JS builds: step-N, pay-NN, social-N).
  3. No machine-local or dev-only URLs (file://, localhost, /Users/...) in shipped files.
  4. In-page links (#id) in data.json point at an id the page renders.
  5. Lists every entry still marked "placeholder": true (warnings, not errors).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
errors, warnings = [], []

# 1. data.json
try:
    data = json.loads((ROOT / "data.json").read_text(encoding="utf-8"))
except Exception as exc:  # noqa: BLE001 - report any parse/IO problem
    print(f"ERROR data.json: {exc}")
    sys.exit(1)
required = ["site", "jackpot", "draw", "cta", "navigation", "hero", "countdown", "howToPlay",
            "prizes", "latestResults", "faq", "footer"]
for key in required:
    if key not in data:
        errors.append(f"data.json is missing the '{key}' block")
if not re.fullmatch(r"\d{1,2}:\d{2}", str(data.get("draw", {}).get("time", ""))):
    errors.append("draw.time must look like 21:00")
if data.get("draw", {}).get("weekday") not in range(7):
    errors.append("draw.weekday must be 0 (Sunday) … 6 (Saturday)")

# 2. referenced assets
shipped = {p: (ROOT / p).read_text(encoding="utf-8") for p in ["index.html", "css/main.css", "js/main.js"]}
refs = set()
refs.update(re.findall(r'(?:href|src)="([^"#:]+?\.(?:css|js|json|png|svg|woff2))"', shipped["index.html"]))
refs.update("css/" + u if not u.startswith("..") else u[3:] for u in re.findall(r"url\(([^)\"']+)\)", shipped["css/main.css"]))
js = shipped["js/main.js"]
refs.update("assets/" + p for p in re.findall(r"(?:A|pic|ico)\('((?:img|icons)/[^'$]+?\.(?:png|svg|webp))'", js))
refs.update("assets/" + p for p in re.findall(r"'((?:img|icons)/[\w-]+\.(?:png|svg|webp))'", js))
refs.update("assets/icons/" + p for p in re.findall(r"ico\('([^'/$]+?\.svg)'", js))
refs.update(f"assets/img/step-{i}.png" for i in range(1, len(data["howToPlay"]["steps"]) + 1))
refs.update(f"assets/img/pay-{i:02d}.png" for i in range(1, len(data["footer"]["payments"]) + 1))
refs.update(f"assets/icons/social-{i}.svg" for i in range(1, len(data["footer"]["social"]) + 1))
refs.add("data.json")
for ref in sorted(refs):
    if not (ROOT / ref).is_file():
        errors.append(f"missing asset: {ref}")

# 3. local / dev-only paths
for name, text in {**shipped, "data.json": (ROOT / "data.json").read_text(encoding="utf-8")}.items():
    for pat in (r"file://", r"localhost", r"127\.0\.0\.1", r"/Users/"):
        if re.search(pat, text):
            errors.append(f"{name} contains a local path/URL matching {pat}")

# 4. in-page anchors
ids = set(re.findall(r'\bid="([\w-]+)"', js + shipped["index.html"]))
ids.update(g["id"] for g in data["footer"]["groups"])  # footer groups get id="<group id>"
def links(node):
    if isinstance(node, dict):
        if isinstance(node.get("href"), str):
            yield node
        for v in node.values():
            yield from links(v)
    elif isinstance(node, list):
        for v in node:
            yield from links(v)
for link in links(data):
    href = link["href"]
    if href.startswith("#") and len(href) > 1 and href[1:] not in ids:
        errors.append(f"link '{link.get('label', href)}' points to #{href[1:]}, which is not on the page")

# 5. placeholders
def placeholders(node, path="data"):
    if isinstance(node, dict):
        if node.get("placeholder") is True:
            yield path
        for k, v in node.items():
            yield from placeholders(v, f"{path}.{k}")
    elif isinstance(node, list):
        for i, v in enumerate(node):
            yield from placeholders(v, f"{path}[{i}]")
for p in placeholders(data):
    warnings.append(f"placeholder still to replace: {p}")

print(f"Checked {len(refs)} asset references and {sum(1 for _ in links(data))} links in data.json.")
for w in warnings:
    print("WARN ", w)
for e in errors:
    print("ERROR", e)
print("OK – ready to deploy (placeholders aside)." if not errors else f"{len(errors)} error(s).")
sys.exit(1 if errors else 0)
