#!/bin/bash
set -e

echo "Starting CyberSec Analyzer initialisation..."

# 1. Create data directories
mkdir -p ./data/uploads

# 2. Run docker-compose up -d
echo "Bringing up Docker containers..."
docker compose up -d

# 3. Wait for Ollama to be healthy
echo "Waiting for Ollama to be reachable at localhost:11434..."
while ! curl -s http://localhost:11434 > /dev/null; do
    sleep 2
done
echo "Ollama is up!"

# 4. Pull required models
echo "Pulling models..."
docker compose exec -T ollama ollama pull mistral
docker compose exec -T ollama ollama pull llava
docker compose exec -T ollama ollama pull llama3

# 5. Print ready message
echo "CyberSec Analyzer is ready!"
echo "Access the app at http://localhost:3000"
