#!/bin/bash

# Check if correct arguments are provided
if [ "$#" -ne 3 ]; then
    echo "🚨 Usage: $0 <target_dir> <output_dir> <size_per_batch>"
    exit 1
fi

# Assign arguments
TARGET_DIR="$1"
OUTPUT_DIR="$2"
BATCH_SIZE="$3"

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

batch_num=1
file_count=0

echo "📂 Splitting files from '$TARGET_DIR' into batches of $BATCH_SIZE in '$OUTPUT_DIR'..."
mkdir -p "$OUTPUT_DIR/batch_$batch_num"

# Move files into batch folders
for file in "$TARGET_DIR"/*; do
    if [ -f "$file" ]; then
        mv "$file" "$OUTPUT_DIR/batch_$batch_num/"
        ((file_count++))

        if (( file_count % BATCH_SIZE == 0 )); then
            echo "📦 Created batch_$batch_num with $BATCH_SIZE files"
            ((batch_num++))
            mkdir -p "$OUTPUT_DIR/batch_$batch_num"
        fi
    fi
done

echo "🎉 All files split into batches! Upload them manually without crashing Nautilus! 🚀"