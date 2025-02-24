Development

In order to develop parts of the application with use of [$PROJECT_ROOT/deploy/docker-compose.yml](../deploy/docker-compose.yml), 
there are multiple helper configurations in [$PROJECT_ROOT/deploy/.dev](../.dev) folder. Most common use cases to use are:

1. development of s-pipes-editor backend
   - `cd $PROJECT_ROOT/deploy`
   - `docker-compose -f docker-compose.yml -f .dev/dc-s-pipes-editor-rest--substitute.yml -f .dev/dc-s-pipes-engine--expose-port.yml up`
   - configure s-pipes-editor backend to point to services defined in docker-compose.yml
   - run s-pipes-editor e.g. using `mvn spring-boot:run`
   - access the application by default at http://localhost:1235
2. development of the frontend
   - `docker-compose -f docker-compose.yml -f .dev/dc-s-pipes-editor--allow-external.yml up`
   - configure s-pipes-editor frontend to point to services defined in docker-compose.yml
   - run s-pipes-editor using `npm run dev`
   - access the application by default at http://localhost:5173
