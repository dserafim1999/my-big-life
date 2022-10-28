@ECHO OFF

CD .\frontend
START npm run dev

CD ..\backend
CALL .\venv\Scripts\Activate & python .\server.py -c "config.json"
PAUSE

