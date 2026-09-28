"""Read the explicit, ephemeral snapshot produced by export-sheet-data.js."""

import json
from pathlib import Path


COLLECTIONS = (
    "work", "education", "skills", "projects", "certificates", "books",
    "bookVersions", "tools", "stories", "interests", "sections", "siteContent",
    "resumeLinks", "socialLinks",
)
LIST_FIELDS = ("keywords", "technologies", "highlights", "architecture",
               "deliverables", "workflow", "tags")


def load_snapshot(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, dict) or not isinstance(data.get("basics"), dict):
        raise ValueError("Snapshot must contain a basics object")
    basics = data["basics"]
    if not isinstance(basics.get("name"), str) or not basics["name"].strip():
        raise ValueError("Profile must contain a nonempty name")
    if not isinstance(basics.get("location", {}), dict):
        raise ValueError("Profile location must be an object")
    profiles = basics.get("profiles", [])
    if not isinstance(profiles, list) or any(not isinstance(row, dict) for row in profiles):
        raise ValueError("Profile profiles must be an array of objects")
    for collection in COLLECTIONS:
        rows = data.setdefault(collection, [])
        if not isinstance(rows, list) or any(not isinstance(row, dict) for row in rows):
            raise ValueError(f"{collection} must be an array of objects")
        ids = [row["id"] for row in rows if row.get("id")]
        if any(not isinstance(item, str) for item in ids) or len(ids) != len(set(ids)):
            raise ValueError(f"{collection} contains invalid or duplicate IDs")
        for row in rows:
            for field in LIST_FIELDS:
                if field in row and (
                    not isinstance(row[field], list)
                    or any(not isinstance(value, str) for value in row[field])
                ):
                    raise ValueError(f"{collection}.{field} must be an array of strings")
            if "featured" in row and not isinstance(row["featured"], bool):
                raise ValueError(f"{collection}.featured must be a boolean")
    return data
