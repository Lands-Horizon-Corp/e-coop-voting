# Scripts

One-off maintenance scripts for bulk image work and S3 cleanup. They are not part of the app. The scripts live in `cmd/` (committed) and `tools/` (a working copy with sample data, not committed).

## Bulk image pipeline
From `tools/readme.txt`:

1. Put all compressed files (zip, rar, and so on) in one directory.
2. Run the **extractor** to uncompress everything in that directory.
3. Move the images into a folder with this layout:
   ```
   target_folder_a
   ├── unopt
   └── optim
   ```
4. Run the **optimizer** with the path to `target_folder_a`.

## The scripts

| Script | Usage | What it does |
| --- | --- | --- |
| `extractor.sh` | `extractor.sh <input-directory> <output-directory>` | Extracts compressed files. Logs to `logs/extractor.log` and errors to `logs/errors` |
| `optimizer.sh` / `img-optimizer.sh` | `optimizer.sh <input-directory>` | Optimizes images from `unopt` into `optim` |
| `batch-shit.sh` | `batch-shit.sh <target_dir> <output_dir> <size_per_batch>` | Splits files into `batch_N` folders of a given size |
| `post-check.sh` | `post-check.sh <dir1> <dir2>` | Compares two directories and logs missing files to `post-check-not-found.log` |
| `s3-batch-delete.sh` | `s3-batch-delete.sh <base_folder> <s3_url>` | Deletes objects from S3 for the files in a folder |
| `test.sh` | `test.sh <input-dir> <output-dir>` | Scratch script |
| `main.py` (in `tools/`) | Python, edit the config at the top | Uploads a folder of photos to S3 with a thread pool, and records uploaded and failed files |

## Careful
- `tools/main.py` has S3 credentials written **directly in the file**. Do not commit it. Move the values into environment variables and rotate those keys, since they have already been seen in plain text.
- `s3-batch-delete.sh` removes objects permanently. Run it against a test bucket first.
- Keep generated folders (`tools/datas`, logs) out of git.
