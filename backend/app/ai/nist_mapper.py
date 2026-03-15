NIST_KEYWORDS = {
    "asset": "ID.AM-01",
    "inventory": "ID.AM-01",
    "mfa": "PR.AA-02",
    "identity": "PR.AA-01",
    "network": "PR.PT-04",
    "segmentation": "PR.PT-04",
    "backup": "RC.RP-01",
    "vendor": "GV.SC-06",
    "logging": "DE.CM-01",
}


def map_text_to_nist(text: str) -> str:
    lowered = text.lower()
    for keyword, nist_id in NIST_KEYWORDS.items():
        if keyword in lowered:
            return nist_id
    return "GV.RM-01"
