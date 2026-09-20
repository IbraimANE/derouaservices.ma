import os
import ftplib
import io
import subprocess

FTP_HOST = "159.8.122.136"
FTP_PORT = 21
FTP_USER = "deroukf3"
FTP_PASS = "bRZ.NaBQW:G2T7.V"
TARGET_DIR = "public_html"

def build():
    print("[1/4] Building production assets with npm run build...")
    result = subprocess.run(["npm", "run", "build"], capture_output=True, text=True)
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

# Browser Caching for Performance
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

# BEGIN cPanel-generated php ini directives, do not edit
# Manual editing of this file may result in unexpected behavior.
# To make changes to this file, use the cPanel MultiPHP INI Editor (Home >> Software >> MultiPHP INI Editor)
# For more information, read our documentation (https://go.cpanel.net/EA4ModifyINI)
<IfModule php8_module>
   php_value error_log "/home/deroukf3/logs/php.error.log"
   php_flag log_errors On
</IfModule>
<IfModule lsapi_module>
   php_value error_log "/home/deroukf3/logs/php.error.log"
   php_flag log_errors On
</IfModule>
# END cPanel-generated php ini directives, do not edit
"""
    with open("dist/.htaccess", "w", encoding="utf-8") as f:
        f.write(htaccess_content)
    print(".htaccess written to dist/.htaccess")

def upload_to_ftp():
    print(f"[3/4] Connecting to Heberjahiz FTP ({FTP_HOST}:{FTP_PORT})...")
    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, FTP_PORT, timeout=20)
    ftp.login(FTP_USER, FTP_PASS)
    ftp.set_pasv(True)
    print("Logged in successfully. Navigating to", TARGET_DIR)
    
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
                # Ensure directory exists on FTP
                try:
                    ftp.mkd(remote_item_path)
                    print(f"Created remote dir: {remote_item_path}")
                except ftplib.error_perm:
                    pass  # Directory probably already exists
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
        "http://www.derouaservices.ma",
        "http://derouaservices.ma",
        f"http://{FTP_HOST}/~{FTP_USER}/"
    ]
    for url in urls:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=10) as response:
                content = response.read().decode('utf-8', errors='ignore')
                has_deroua = "Deroua" in content or "خدمات الدروة" in content or "derouaservices" in content
                print(f"GET {url} -> HTTP {response.status} | Title found: {has_deroua}")
        except Exception as e:
            print(f"GET {url} -> {e}")

if __name__ == "__main__":
    build()
    prepare_htaccess()
    upload_to_ftp()
    verify()
