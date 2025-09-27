#!/bin/bash

# Check if filename and code are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <python_file.py> '<python_code>'"
    echo "You can pass multi-line code using quotes or EOF syntax."
    exit 1
fi

PYTHON_FILE="$1"
shift   # remove filename from arguments
PYTHON_CODE="$@"

# Write the code into the file
cat <<EOF > "$PYTHON_FILE"
$PYTHON_CODE
EOF

echo "Python file '$PYTHON_FILE' created."
