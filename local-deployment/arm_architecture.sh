function cool_spin() {
    local -r delay=0.1
    local cool_spinstr='|/-\'
    local spin_seconds=$1
    local end=$((SECONDS+spin_seconds))
    while [ $SECONDS -lt $end ]; do
        local temp=${cool_spinstr#?}
        printf " [%c]  " "$cool_spinstr"
        local cool_spinstr=$temp${cool_spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
}

loading() {
    local pid=$!
    local delay=0.75
    local spinstr='|/-\'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

echo "Starting the ARM architecture deployment script"
cool_spin 2
echo "This script will guide you through the process of deploying a model on your local machine."
cool_spin 2


if command -v ollama > /dev/null 2>&1; then
    export USE_OLLAMA=true
    echo "🎉 Ollama is installed. Going to the next step"
else
    echo "🚫 We have not detected Ollama.ai CLI installed"
    echo "✨ Highly recommend to increase speed of LLM to visit https://ollama.ai and install ollama on your laptop!"
    cool_spin 2
    echo "🚨 Docker image is NOT capable of Intel/AMD processors optimizations"
    cool_spin 0.7
    echo "Do you want to use docker image for LLM? (yes/no)"
    select use_docker in "yes" "no"; do
        case $use_docker in
            yes ) 
                export USE_OLLAMA=false
                break;;
            no ) 
                export USE_OLLAMA=false
                echo "Exiting the script."; exit 1;;
        esac
    done
fi

cool_spin 1


echo "🚀 Select the model you want to run: "
echo "📚 List of available models can be checked here https://ollama.ai/library"



PS3='🟢 Model choice: '
select model in "mistral" "llama2" "vicuna" "custom"; do
    case $model in
        mistral ) break;;
        llama2 ) break;;
        vicuna ) break;;
        custom ) 
            echo "📝 Enter the custom model name: "
            read model
            break;;
    esac
done



if [ "$USE_OLLAMA" = true ] ; then
    ollama pull $model
    if command -v pip > /dev/null 2>&1; then
        pip install litellm &> /dev/null & loading
    elif command -v pip3 > /dev/null 2>&1; then
        pip3 install litellm &> /dev/null & loading
    else
        echo "Neither pip nor pip3 is available. Please install one of them and try again."
        echo "Installation of "litellm" package failed"
    fi
    echo "🎉 Running litellm server locally"
    litellm --model ollama/$model --temperature 0.3 --max_tokens 2048 --port 8111
else
    echo "🔨 Building the docker image with the model $model 🔨 "
    docker build --build-arg LLM_MODEL=$model -t local-llm .
    docker run --gpus all -d -p 8111:8000 local-llm
    echo "🚀 Running the docker image with Ollama LLM $model on port 8111. To stop it, run ./arm_stop_running.sh  🚀"
fi

