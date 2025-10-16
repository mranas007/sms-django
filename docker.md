<!-- makes a simple docker image and run Project -->
### Part: 1
docker build --tag python-django .
docker run --publish 8000:8000 python-django

<!-- Makes a docker image with compose and run Project -->
### Part: 2
docker compose build
docker compose run --rm app django-admin startproject core .
docker compose up

<!-- Used docker compose image to run Project, DB and used terminal -->
### Part: 3
docker compose build
docker compose run --rm app django-admin startproject core .
docker compose up
docker exec -it djano_app /bin/bash

<!-- Used a docker compose image to run Project, DB, redis, celery -->
### part: 4 
<!-- build the image -->
docker compose build
<!-- Run the container and create the project -->
docker compose run --rm app django-admin startproject core .
docker compose up
<!-- build + up -->
docker compose up --build

docker compose run [contianer_name] sh -c "django-admin startapp app ."
docker exec -it [contianer_name] sh

# Run Celery Task
    python manage.py shell
    from newapp.tasks import add
    task add.delay(2, 2)

Info:
PYTHONUNBUFFERED:
Setting the non-empty value of PYTHONU BUFFERED means that the python output is transmitted directly to the terminal without being buffered and that allows displaying the application's output in real-time.