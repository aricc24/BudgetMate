# Docker Setup and Commands

You're in the `docker` folder. From here, open your terminal and execute the following command to create images and run containers:

docker compose up --build

(or `docker-compose up --build`, depending on which one is installed on your system). This command is for running the project for the first time. Afterward, you can simply run:

docker compose up

(or `docker-compose up`, depending on which one is installed) without any issues.

To stop the program, press `Ctrl + C` in your terminal and then run:

docker compose down

If there's a serious development error, execute:

docker compose down -v

Copy code
