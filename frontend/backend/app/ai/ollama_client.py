from typing import Any


def run_mock_ollama_analysis(text: str) -> dict[str, Any]:
    findings = []

    if "mfa" not in text.lower():
        findings.append(
            {
                "title": "MFA coverage unclear or missing",
                "description": "Evidence for mandatory MFA was not found in the uploaded material.",
                "domain": "Protect",
                "severity": "high",
                "confidence": 0.81,
                "recommendation": "Enforce MFA for privileged and remote access.",
            }
        )

    if "inventory" not in text.lower() and "asset" not in text.lower():
        findings.append(
            {
                "title": "Asset inventory process appears weak",
                "description": "No reliable asset inventory process was detected in the evidence.",
                "domain": "Identify",
                "severity": "medium",
                "confidence": 0.72,
                "recommendation": "Create or automate a continuous asset inventory process.",
            }
        )

    if not findings:
        findings.append(
            {
                "title": "Manual review recommended",
                "description": "The uploaded data did not trigger any obvious demo findings, but deeper validation is still recommended.",
                "domain": "Govern",
                "severity": "low",
                "confidence": 0.55,
                "recommendation": "Run a deeper framework-specific assessment.",
            }
        )

    questions = [
        "Do employees use personal devices for work access?",
        "Is MFA mandatory for admin and VPN accounts?",
    ]

    return {
        "summary": "Mock Ollama pipeline completed.",
        "questions": questions,
        "findings": findings,
    }
