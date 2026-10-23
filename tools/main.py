import os
import sys
import boto3
from concurrent.futures import ThreadPoolExecutor, as_completed
from botocore.config import Config
from threading import Lock

# --- CONFIG ---
S3_CONFIG = {
    "endpoint_url": "https://bucket-production-1480.up.railway.app",
    "region_name": "auto",
    "bucket": "ace",
    "access_key": "mLzwpe02dUd8Fnj5YDfB5CYUsI3C24Lv",
    "secret_key": "yJzSWkG7KLe7C96B0EUBCdXT6j80RyB9y5a7WMek5aE6Bpvb",
}

VALID_EXTENSIONS = (".jpg", ".jpeg", ".png", ".webp")
MAX_WORKERS = 10
record_lock = Lock()

# --- S3 CLIENT ---
s3_client = boto3.client(
    "s3",
    endpoint_url=S3_CONFIG["endpoint_url"],
    aws_access_key_id=S3_CONFIG["access_key"],
    aws_secret_access_key=S3_CONFIG["secret_key"],
    region_name=S3_CONFIG["region_name"],
    config=Config(
        signature_version="s3v4",
        retries={"max_attempts": 5, "mode": "adaptive"},
        max_pool_connections=50,
    ),
)


# --- UTILITIES ---
def load_record(path):
    if not os.path.exists(path):
        return set()
    with open(path, "r") as f:
        return set(line.strip() for line in f)


def append_record(path, filename):
    with record_lock:
        with open(path, "a") as f:
            f.write(filename + "\n")
            f.flush()
            os.fsync(f.fileno())  # ensure write to disk


def upload_single(file_path, filename, uploaded_file_path, failed_file_path):
    key = f"member/{filename}"
    try:
        s3_client.upload_file(file_path, S3_CONFIG["bucket"], key)
        append_record(uploaded_file_path, filename)
        url = f"{S3_CONFIG['endpoint_url']}/{S3_CONFIG['bucket']}/{key}"
        return True, filename, url
    except Exception as e:
        append_record(failed_file_path, filename)
        return False, filename, str(e)


# --- MAIN FUNCTION ---
def upload_photos(target_folder):
    optim_folder = os.path.join(target_folder, "optim")
    uploaded_file_path = os.path.join(target_folder, "uploaded_files.txt")
    failed_file_path = os.path.join(target_folder, "failed_files.txt")

    if not os.path.isdir(optim_folder):
        print(f"❌ Folder not found: {optim_folder}")
        return

    uploaded = load_record(uploaded_file_path)
    failed = load_record(failed_file_path)

    files_to_upload = []
    for entry in os.scandir(optim_folder):
        if not entry.is_file():
            continue
        name = entry.name
        if not name.lower().endswith(VALID_EXTENSIONS):
            continue
        if name in uploaded:
            print(f"⏭ Skipping (already uploaded): {name}")
            continue
        files_to_upload.append((entry.path, name))

    print(f"Found {len(files_to_upload)} files to upload.")

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [
            executor.submit(
                upload_single, path, name, uploaded_file_path, failed_file_path
            )
            for path, name in files_to_upload
        ]

        for future in as_completed(futures):
            ok, filename, result = future.result()
            if ok:
                print(f"✅ Uploaded: {filename}")
            else:
                print(f"❌ Failed: {filename} -> {result}")

    print("---- Upload Process Finished ----")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python main.py ./target-folder")
        sys.exit(1)

    target = sys.argv[1]
    upload_photos(target)
