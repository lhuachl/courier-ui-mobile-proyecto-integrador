# Automatic Backend Startup

This project now includes automatic Python backend startup functionality. When you start the mobile app, the Python backend will automatically start if it's not already running.

## How it works

The automatic backend startup is implemented using npm pre-scripts that run before the main commands:

- `prestart` - Runs before `npm start`
- `preandroid` - Runs before `npm run android`
- `preios` - Runs before `npm run ios`
- `preweb` - Runs before `npm run web`

## Features

- ✅ **Automatic Detection**: Checks if backend is already running on port 8000
- ✅ **Smart Startup**: Only starts backend if it's not already running
- ✅ **Virtual Environment Support**: Automatically detects and uses Python virtual environment
- ✅ **Error Handling**: Gracefully handles startup failures without blocking mobile app
- ✅ **Cross-Platform**: Works on Windows, macOS, and Linux

## Usage

Simply run any of the normal commands and the backend will start automatically:

```bash
npm start        # Starts backend + mobile dev server
npm run android  # Starts backend + Android development
npm run ios      # Starts backend + iOS development
npm run web      # Starts backend + web development
```

## Manual Backend Control

If you need to start the backend manually:

```bash
cd Python
python main.py
```

Or using the virtual environment:

```bash
cd Python
.venv\Scripts\python.exe main.py  # Windows
# or
.venv/bin/python main.py            # macOS/Linux
```

## Troubleshooting

If the backend fails to start automatically:

1. **Check Python Installation**: Ensure Python is installed and accessible
2. **Check Virtual Environment**: Make sure the virtual environment is set up in the Python folder
3. **Check Dependencies**: Ensure all Python dependencies are installed (`pip install -r requirements.txt`)
4. **Manual Start**: Start the backend manually using the commands above
5. **Check Logs**: Look at the console output for detailed error messages

The mobile app will still start even if the backend fails to start automatically.