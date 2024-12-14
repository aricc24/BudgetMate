# Docker Setup and Commands  

This guide will help you set up and manage your Docker containers for the project.  

---

## Initial Setup  

1. Open a terminal and navigate to the `docker` folder.  
2. Run the following command to build the images and start the containers:  

   ```bash
   docker compose up --build
   ```  

   > **Note**: If your system uses `docker-compose` instead of `docker compose`, use the following command:  
   ```bash
   docker-compose up --build
   ```  

---

## Running the Project  

After the initial setup, you can start the project with:  

```bash
docker compose up
```  

Or, if your system uses `docker-compose`:  

```bash
docker-compose up
```  

This will start the containers without rebuilding them.  

---

## Stopping the Project  

To stop the running containers:  

1. Press `Ctrl + C` in the terminal where the project is running.  
2. Then, run:  

   ```bash
   docker compose down
   ```  

   Or, if you're using `docker-compose`:  

   ```bash
   docker-compose down
   ```  

---

## Resolving Errors  

If you encounter a serious issue during development, you may need to remove volumes to reset the containers. Run:  

```bash
docker compose down -v
```  

Or, for `docker-compose`:  

```bash
docker-compose down -v
```  

This command stops the containers and removes associated volumes, ensuring a clean slate.  

Another recommended command to remove all volumes is:  

```bash
docker volume ls -q | xargs docker volume rm
```  

---

## Recommended Versions  

To ensure compatibility, use the following recommended versions:  

- **Docker**: `Docker version 26.1.4`  
- **Docker Compose**: `docker-compose version 1.29.2`  

---

By following these steps, you’ll have a smooth experience setting up and managing your Docker environment!

