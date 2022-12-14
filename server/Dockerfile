FROM python:3.9-slim
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements.txt

COPY . .
EXPOSE 8080
CMD ["python", "main.py"]
