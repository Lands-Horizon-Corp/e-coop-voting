#!/bin/bash

if [[ $# -ne 2 ]]; then
    echo "Usage: $0 <input-dir> <output-dir>"
    exit 1
fi

SOURCE_DIR="$1"
TARGET_DIR="$2"

if [[ ! -d "$SOURCE_DIR" || ! -d "$TARGET_DIR" ]]; then
    echo "Error: One or both directories do not exist."
    exit 1
fi

for file in "$SOURCE_DIR"/*; do
    
    
    if [[ -f "$file" ]]; then
        filename=$(basename -- "$file")
        name="${filename%.*}"
        ext="${filename##*.}"
        echo "checking file $name in $TARGET_DIR/$name"
        
        if ls "$TARGET_DIR"/"$name" &>/dev/null; then
            echo "YES: $name"
        else
            echo "NO: $name"
        fi
    fi
done
