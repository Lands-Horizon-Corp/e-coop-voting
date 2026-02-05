#!/bin/bash

# Ensure correct usage
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <base_folder> <s3_url>"
  exit 1
fi

BASE_FOLDER="$1"
S3_URL="$2"

# Iterate over files in the base folder
for file in "$BASE_FOLDER"/*; do
  if [[ -f "$file" ]]; then
    filename=$(basename "$file")
    name_without_ext="${filename%.*}"

    # Delete corresponding file in S3
    aws s3 rm "$S3_URL/$name_without_ext"
    echo "Attempted to delete: $S3_URL/$name_without_ext"
  fi
done