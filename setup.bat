@ECHO OFF

CD .\frontend
CALL npm install

ECHO Front-End Setup Complete!

CALL cd ../backend && python -m venv venv 
CALL .\venv\Scripts\Activate & pip install -r "requirements.txt" && python .\setup_files.py

ECHO Back-End Setup Complete!

PAUSE

