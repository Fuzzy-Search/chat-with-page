#!/bin/bash

# Function to install pnpm based on detected OS
install_pnpm() {
  # Check for curl or wget availability
  HAS_CURL=$(which curl)
  HAS_WGET=$(which wget)

  # URL for the installation script
  INSTALL_URL="https://get.pnpm.io/install.sh"

  # Install pnpm based on available download tool
  if [[ ! -z $HAS_CURL ]]; then
    curl -fsSL $INSTALL_URL | sh -
  elif [[ ! -z $HAS_WGET ]]; then
    wget -qO- $INSTALL_URL | sh -
  else
    echo "Error: curl or wget is required to download pnpm."
    exit 1
  fi

  # Verify installation
  if [[ $(which pnpm) ]]; then
    echo "pnpm has been installed successfully."
  else
    echo "Installation failed. Please check your script and try again."
    exit 1
  fi
}

# Detect the operating system
OS="$(uname)"
case $OS in
  'Linux' | 'FreeBSD' | 'SunOS' | 'AIX')
    if [[ $(which pnpm) ]]; then
      echo "pnpm is already installed."
    else
      install_pnpm
    fi
    ;;
  'WindowsNT')
    # Windows installation requires PowerShell
    if powershell -Command "Get-Command pnpm -ErrorAction SilentlyContinue"; then
      echo "pnpm is already installed."
    else
      powershell -Command "iwr https://get.pnpm.io/install.ps1 -useb | iex"
    fi
    ;;
  'Darwin')
    # macOS users might prefer using Homebrew if installed
    if [[ $(which brew) ]]; then
      if brew list pnpm &>/dev/null; then
        echo "pnpm is already installed."
      else
        brew install pnpm
      fi
    elif [[ $(which pnpm) ]]; then
      echo "pnpm is already installed."
    else
      install_pnpm
    fi
    ;;
  *)
    echo "Unknown operating system: $OS"
    exit 1
    ;;
esac


# now check for node to be install