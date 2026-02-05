#!/bin/bash

# Ensure correct usage
if [ "$#" -ne 2 ]; then
    echo "❌ Usage: $0 <input-directory> <output-directory>"
    exit 1
fi

INPUT_DIR="$1"
OUTPUT_DIR="$2"
ERROR_DIR="logs/errors"
LOG_FILE="logs/extractor.log"

# Check if input directory exists
if [ ! -d "$INPUT_DIR" ]; then
    echo "🚨 Error: Input directory does not exist."
    exit 1
fi

# Create necessary directories
mkdir -p "$OUTPUT_DIR" "$ERROR_DIR" "logs"

# Clear the log file
> "$LOG_FILE"

# Counters
total_files=0
success_files=0
error_files=0

# Process each compressed file in the input directory
find "$INPUT_DIR" -maxdepth 1 -type f \( -name "*.rar" -o -name "*.zip" -o -name "*.7z" -o -name "*.tar.gz" -o -name "*.tgz" -o -name "*.tar.bz2" -o -name "*.tbz2" -o -name "*.tar.xz" -o -name "*.txz" \) | while read file; do
    ((total_files++))

    filename=$(basename -- "$file")
    extract_dir="$OUTPUT_DIR/${filename%.*}"

    # Skip extraction if the directory already exists
    if [ -d "$extract_dir" ]; then
        echo "💨 Skipping: $filename (Already extracted)" | tee -a "$LOG_FILE"
        continue
    fi

    mkdir -p "$extract_dir"  # Create extraction directory

    echo "🔄 Extracting: $filename..." | tee -a "$LOG_FILE"

    case "$file" in
        *.rar)
            unrar x -o+ "$file" "$extract_dir" 2>&1 | tee -a "$LOG_FILE"
            ;;
        *.zip)
            unzip -o "$file" -d "$extract_dir" 2>&1 | tee -a "$LOG_FILE"
            ;;
        *.7z)
            echo "🗜 Extracting: $filename using 7z..." | tee -a "$LOG_FILE"
            if 7z x "$file" -o"$extract_dir" -y &>> "$LOG_FILE"; then
                ((success_files++))
                echo "✅ Extracted: $filename → $extract_dir" | tee -a "$LOG_FILE"
            else
                ((error_files++))
                echo "❌ Extraction failed: $filename" | tee -a "$LOG_FILE"
            fi
            continue  # Skip CLI output for 7z
            ;;
        *.tar.gz|*.tgz)
            tar -xzf "$file" -C "$extract_dir" 2>&1 | tee -a "$LOG_FILE"
            ;;
        *.tar.bz2|*.tbz2)
            tar -xjf "$file" -C "$extract_dir" 2>&1 | tee -a "$LOG_FILE"
            ;;
        *.tar.xz|*.txz)
            tar -xJf "$file" -C "$extract_dir" 2>&1 | tee -a "$LOG_FILE"
            ;;
        *)
            echo "🚫 Unsupported file type: $filename" | tee -a "$LOG_FILE"
            ((error_files++))
            continue
            ;;
    esac

    # Check if extraction was successful
    if [ "$(ls -A "$extract_dir")" ]; then
        ((success_files++))
        echo "✅ Extracted: $filename → $extract_dir" | tee -a "$LOG_FILE"
    else
        ((error_files++))
        echo "❌ Extraction failed: $filename" | tee -a "$LOG_FILE"
    fi
done

# Summary
echo "" | tee -a "$LOG_FILE"
echo "📊 Extraction Summary:" | tee -a "$LOG_FILE"
echo "📦 Total files: $total_files" | tee -a "$LOG_FILE"
echo "✅ Successfully extracted: $success_files" | tee -a "$LOG_FILE"
echo "❌ Failed extractions: $error_files" | tee -a "$LOG_FILE"
echo "📄 Logs saved in $LOG_FILE" | tee -a "$LOG_FILE"