#!/bin/bash

# Check if both directories are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <dir1> <dir2>"
    exit 1
fi

dir1="$1"
dir2="$2"
log_file="post-check-not-found.log"

# Ensure log file is empty before writing
> "$log_file"

declare -A dir2_files
success=0
not_found=0
total_files=0

# Preload filenames (without extensions) from dir2 into an associative array (case-insensitive)
while IFS= read -r file; do
    lowercase_file=$(echo "${file%.*}" | tr '[:upper:]' '[:lower:]')
    dir2_files["$lowercase_file"]=1
done < <(find "$dir2" -type f -exec basename {} \;)

# Iterate over files in dir1
for file in "$dir1"/*; do
    if [ -f "$file" ]; then
        ((total_files++))
        filename=$(basename "$file")
        filename_no_ext="${filename%.*}"

        # Convert to lowercase for case-insensitive comparison
        filename_no_ext_lower=$(echo "$filename_no_ext" | tr '[:upper:]' '[:lower:]')

        echo -n "📄 $total_files Checking: $filename_no_ext ... "

        # Fast case-insensitive lookup
        if [[ -z "${dir2_files[$filename_no_ext_lower]}" ]]; then
            echo "🔥 NOT FOUND" | tee -a "$log_file"
            echo "$filename_no_ext" | tee -a "$log_file"
            ((not_found++))
            continue
        fi

        echo "✅ FOUND"
        ((success++))
    fi
done

# Summary
{
    echo -e "\n🎉 Check complete. Logs saved to $log_file."
    echo "📄 Total Files Checked: $total_files"
    echo "✅ Files Found: $success"
    echo "🔥 Files Not Found: $not_found"
} | tee -a "$log_file"