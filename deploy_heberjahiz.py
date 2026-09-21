"""Build and upload the canonical root project over explicit FTPS."""
import ftplib
import os
from pathlib import Path
import shutil
import ssl
import subprocess

ROOT = Path(__file__).resolve().parent

def main():
    required = ["DEROUA_FTP_HOST", "DEROUA_FTP_USER", "DEROUA_FTP_PASSWORD"]
    missing = [name for name in required if not os.environ.get(name)]
    if missing:
        raise SystemExit("Missing environment variables: " + ", ".join(missing))
    npm = shutil.which("npm.cmd" if os.name == "nt" else "npm")
    if not npm:
        raise SystemExit("Node.js/npm must be installed.")
    subprocess.run([npm, "run", "build"], cwd=ROOT, check=True)
    dist = ROOT / "dist"
    files = sorted(path for path in dist.rglob("*") if path.is_file())
    if not (dist / "index.html").is_file():
        raise SystemExit("Build did not produce dist/index.html.")
    # Upload the entry point last, after its referenced assets.
    files.sort(key=lambda path: path.name == "index.html")
    with ftplib.FTP_TLS(context=ssl.create_default_context()) as ftp:
        ftp.connect(os.environ["DEROUA_FTP_HOST"], int(os.environ.get("DEROUA_FTP_PORT", "21")), timeout=30)
        ftp.login(os.environ["DEROUA_FTP_USER"], os.environ["DEROUA_FTP_PASSWORD"])
        ftp.prot_p()
        ftp.cwd(os.environ.get("DEROUA_FTP_DIRECTORY", "/public_html"))
        created = set()
        for path in files:
            relative = path.relative_to(dist).as_posix()
            parent = path.relative_to(dist).parent
            for directory in reversed([parent, *parent.parents]):
                name = directory.as_posix()
                if name == "." or name in created:
                    continue
                try:
                    ftp.mkd(name)
                except ftplib.error_perm:
                    # Verify it is an existing accessible directory, not a permissions error.
                    current = ftp.pwd()
                    ftp.cwd(name)
                    ftp.cwd(current)
                created.add(name)
            with path.open("rb") as content:
                ftp.storbinary("STOR " + relative, content)
    print("Upload completed. Verify the public website and Firebase rules.")

if __name__ == "__main__":
    main()
