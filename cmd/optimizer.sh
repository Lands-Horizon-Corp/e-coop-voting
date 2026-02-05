#!/bin/bash

# Ensure correct usage
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <input-directory>"
    exit 1
fi

INPUT_DIR="$1/unopt"
OUTPUT_DIR="$1/optim"
ERROR_DIR="$INPUT_DIR/../logs/errors"
LOG_FILE="$INPUT_DIR/../logs/strip-convert.log"

if [ ! -d "$INPUT_DIR" ]; then
    echo "Error: Input directory does not exist."
    exit 1
fi

mkdir -p "$OUTPUT_DIR"
mkdir -p "$ERROR_DIR"

> "$LOG_FILE"

file_counter=0

# for file in "$INPUT_DIR"/*.{jpg,jpeg,png,gif,tiff,bmp}; do
for file in "$INPUT_DIR"/*; do
    [ -e "$file" ] || continue
    
    filename=$(basename -- "$file")
    filename_noext="${filename%.*}"
    final_name_upper="$(echo "$filename_noext" | tr '[:lower:]' '[:upper:]')"

    ((file_count++))
    
    if [ -f "$OUTPUT_DIR/$final_name_upper.webp" ]; then
        echo "💨 $file_count: Skipping $file ($final_name_upper) because it already exists in $OUTPUT_DIR/$final_name_upper" | tee -a "$LOG_FILE"
        continue
    fi

    output_webp="$OUTPUT_DIR/$final_name_upper.webp"

    # Force overwrite using `-y`
    if ! ffmpeg -y -loglevel error -i "$file" -q:v 75 "$output_webp" 2>> "$LOG_FILE"; then
        echo "❤️‍🔥 $file_count: Conversion failed: $file" | tee -a "$LOG_FILE"
        mv "$file" "$ERROR_DIR/"
        continue
    fi

    # echo "✨ $file_count: Converted $file → $output_webp" | tee -a "$LOG_FILE"
    
    # # Move converted file and rename it
    # if ! mv -f "$output_webp" "$OUTPUT_DIR/$final_name_upper" 2>> "$LOG_FILE"; then
    #     echo "❤️‍🔥 $file_count: Move failed: $output_webp" | tee -a "$LOG_FILE"
    #     mv "$file" "$ERROR_DIR/"
    #     continue
    # fi
    
    echo "✨ $file_count: Converted $file → $OUTPUT_DIR/$final_name_upper" | tee -a "$LOG_FILE"
done

echo "😇 $file_count: Conversion complete! Errors (if any) logged in $LOG_FILE"
