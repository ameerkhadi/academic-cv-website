# -*- coding: utf-8 -*-
"""تشغيلٌ محلّيّ:  python3 run.py  →  http://127.0.0.1:8000"""
import os, uvicorn
if __name__ == "__main__":
    uvicorn.run("app.main:app", host=os.environ.get("TK_HOST", "127.0.0.1"),
                port=int(os.environ.get("TK_PORT", "8000")), reload=bool(os.environ.get("TK_RELOAD")))
