#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deroua Services (derouaservices.ma)
Secure FTP deployment script for Heberjahiz / cPanel LiteSpeed hosting.

Credentials are read safely from environment variables or .env file,
or interactively requested if not set. NEVER commit actual passwords to Git!
"""

import os
import ftplib
import subprocess
import getpass
from pathlib import Path

# Try loading .env if dotenv is available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

FTP_HOST = os.getenv("HEBERJAHIZ_FTP_HOST", "159.8.122.136")
FTP_PORT = int(os.getenv("HEBERJAHIZ_FTP_PORT", 21))
FTP_USER = os.getenv("HEBERJAHIZ_FTP_USER", "")
FTP_PASS = os.getenv("HEBERJAHIZ_FTP_PASS", "")
TARGET_DIR = os.getenv("HEBERJAHIZ_TARGET_DIR", "public_html")

def ensure_credentials():
    global FTP_USER, FTP_PASS
    if not FTP_USER:
        print("[!] HEBERJAHIZ_FTP_USER environment variable not found.")
        FTP_USER = input("Enter Heberjahiz FTP Username: ").strip()
    if not FTP_PASS:
        print("[!] HEBERJAHIZ_FTP_PASS environment variable not found.")
        FTP_PASS = getpass.getpass("Enter Heberjahiz FTP Password: ").strip()

def build():
    print("[1/4] Building production assets with npm run build...")
    result = subprocess.run(["npm", "run", "build"], capture_output=True, text=True, shell=True)
    if result.returncode != 0:
        print("Build failed:\n", result.stderr)
        raise RuntimeError("npm run build failed")
    print("Build successful.")

def prepare_htaccess():
    print("[2/4] Generating optimized .htaccess for cPanel & LiteSpeed...")
    htaccess_content = """# Directory Index configuration
DirectoryIndex index.html index.php

# Single Page Application (SPA) Routing for Vite / React
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Browser Caching & Gzip/Brotli for Performance
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>
"""
    dist_dir = Path("dist")
    dist_dir.mkdir(parents=True, exist_ok=True)
    with open(dist_dir / ".htaccess", "w", encoding="utf-8") as f:
        f.write(htaccess_content)
    print(".htaccess written to dist/.htaccess")

def upload_to_ftp():
    ensure_credentials()
    print(f"[3/4] Connecting to Heberjahiz FTP ({FTP_HOST}:{FTP_PORT}) as {FTP_USER}...")
    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, FTP_PORT, timeout=25)
    ftp.login(FTP_USER, FTP_PASS)
    ftp.set_pasv(True)
    print(f"Logged in successfully. Navigating to {TARGET_DIR}...")
    
    ftp.cwd(TARGET_DIR)
    
    # Check if placeholder index.php exists and rename it
    remote_files = ftp.nlst()
    if "index.php" in remote_files:
        print("Renaming default index.php placeholder to index.php.placeholder...")
        try:
            if "index.php.placeholder" in remote_files:
                ftp.delete("index.php.placeholder")
            ftp.rename("index.php", "index.php.placeholder")
        except Exception as e:
            print("Notice renaming index.php:", e)

    dist_dir = os.path.abspath("dist")
    
    def upload_directory(local_path, remote_sub=""):
        for item in sorted(os.listdir(local_path)):
            local_item_path = os.path.join(local_path, item)
            remote_item_path = f"{remote_sub}/{item}" if remote_sub else item
            
            if os.path.isdir(local_item_path):
                try:
                    ftp.mkd(remote_item_path)
                    print(f"Created remote directory: {remote_item_path}")
                except ftplib.error_perm:
                    pass  # Directory already exists
                upload_directory(local_item_path, remote_item_path)
            else:
                with open(local_item_path, "rb") as f:
                    ftp.storbinary(f"STOR {remote_item_path}", f)
                    size_kb = os.path.getsize(local_item_path) / 1024
                    print(f"Uploaded: {remote_item_path} ({size_kb:.1f} KB)")

    upload_directory(dist_dir)
    ftp.quit()
    print("FTP upload completed successfully.")

def verify():
    print("[4/4] Verifying live website availability...")
    import urllib.request
    urls = [
        "https://derouaservices.ma",
        "https://www.derouaservices.ma"
    ]
    for url in urls:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=10) as response:
                content = response.read().decode('utf-8', errors='ignore')
                has_deroua = "Deroua" in content or "خدمات الدروة" in content or "derouaservices" in content
                print(f"GET {url} -> HTTP {response.status} | Verified: {has_deroua}")
        except Exception as e:
            print(f"GET {url} -> {e}")

if __name__ == "__main__":
    build()
    prepare_htaccess()
    upload_to_ftp()
    verify()
