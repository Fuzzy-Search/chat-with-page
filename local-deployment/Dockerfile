FROM ollama/ollama as ollama

ARG LLM_MODEL=llama2

RUN echo "auto installing ${LLM_MODEL}"

# auto install ollama/llama2
RUN ollama serve & sleep 2 && ollama pull ${LLM_MODEL}

RUN echo "installing litellm"

RUN apt-get update

# Install Python
RUN apt-get install -y python3 python3-pip

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt

RUN python3 -m pip install litellm
COPY start.sh /start.sh
ENTRYPOINT [ "/bin/bash", "/start.sh" ]