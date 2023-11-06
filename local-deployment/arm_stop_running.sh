
echo "🛑 Stopping the docker image with Ollama LLM on port 8000 🛑"
docker stop $(docker ps -q --filter ancestor=local-llm)
echo "✅ Docker image with Ollama LLM has been stopped ✅"
