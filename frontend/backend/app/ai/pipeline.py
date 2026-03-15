from app.ai.loaders import load_file_text
from app.ai.nist_mapper import map_text_to_nist
from app.ai.ollama_client import run_mock_ollama_analysis


def run_analysis_pipeline(file_path: str) -> dict:
    text = load_file_text(file_path)
    result = run_mock_ollama_analysis(text)

    for finding in result.get("findings", []):
        finding["nist_id"] = map_text_to_nist(
            f"{finding.get('title', '')} {finding.get('description', '')} {text[:250]}"
        )

    return result
