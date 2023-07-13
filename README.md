# SPipes Editor UI

We will use `$PROJECT_ROOT` as the root directory of this project, i.e., the directory where this README is located. Similarly, we will define:
- `$SPIPES_EDITOR_ROOT` -- root folder of cloned repository [s-pipes-editor](https://github.com/kbss-cvut/s-pipes-editor)
- `$SPIPES_MODULES_ROOT` -- root folder of cloned repository [s-pipes-modules](https://kbss.felk.cvut.cz/gitblit/summary/s-pipes-modules.git) 
- `$SCRIPTS_ROOT` -- root folder of cloned repository [s-pipes](https://github.com/kbss-cvut/s-pipes)




### Running Editor UI

To run the editor, do the following steps:
- create `$PROJECT_ROOT/.env` file and configure the following parameters:
  - `SCRIPTPATHS` -- e.g. `$SPIPES_MODULES_ROOT;$SPIPES_ROOT/doc/examples/hello-world/`, note the separator ";"
  - `SCRIPTPATHS_SPE` -- e.g. `$SPIPES_MODULES_ROOT,$SPIPES_ROOT/doc/examples/hello-world/`, note the separator  ","
  - `SCRIPTRULES` --  e.g. `$SPIPES_EDITOR_ROOT/src/main/resources/rules`
  - `RDF4J_REPOSITORYNAME` -- e.g. `s-pipes-hello-world`
  - `RDF4J_PCONFIGURL` -- e.g. `$SPIPES_ROOT/doc/examples/hello-world/config.ttl`
- run `docker-compose up` in the root directory of this project
- create rdf4j repository with the name specified in `RDF4J_REPOSITORYNAME`
- access the editor from URL `http://localhost:3000`

### Building

```
$ npm install
```

IMPORTANT - https://github.com/facebook/create-react-app/issues/10811.
The `npm@7.13.0` version is required and `npm update --force` command.

Will create a `dist` directory containing your compiled code.

Depending on your needs, you might want to do more optimization to the production build.

## Development

Run development server

```
$ npm run dev
```

### Dockerization
The docker image of SPipes Editor UI can be built by `docker build -t s-pipes-editor-ui .`

Then, SPipes Editor UI can be run as `docker run -e SERVICE_URL=<SPIPES_BACKEND_URL> -p 3000:80 s-pipes-editor-ui`   
where <SPIPES_BACKEND_URL> denotes the URL where SPipes backend is running.

### Docker-compose

You can run editor together with backend using docker orchestration. The docker-compose is composed of 4 services and can be run via `docker-compose up`:
* [chlupnoha/s-pipes-editor-ui:latest](https://hub.docker.com/repository/docker/chlupnoha/s-pipes-editor-ui) - accessible on `http://localhost:3000`
* [chlupnoha/s-pipes-editor-rest:latest](https://hub.docker.com/repository/docker/chlupnoha/s-pipes-editor-rest) - accessible on `http://localhost:18115` with [configuration options](https://github.com/kbss-cvut/s-pipes-editor#dockerization)
* [chlupnoha/spipes-engine:latest](https://hub.docker.com/repository/docker/chlupnoha/spipes-engine) - accessible on `http://localhost:8081` with [configuration options](https://github.com/kbss-cvut/s-pipes#dockerization) 
* [eclipse/rdf4j-workbench:amd64-3.5.0](https://hub.docker.com/r/eclipse/rdf4j-workbench) - accessible on `http://localhost:8080/rdf4j-workbench`

**Required manual steps:** 
* s-pipes-engine
    * The service does not automatically create the repository in RDF4J, so manual creation of a repository is required (after running `docker-compose up`).
      * First open the RDF4J Workbench: `http://localhost:<port>/rdf4j-workbench` where `<port>` is the RDF4J service port specified in `docker-compose.yml`.
      * Then follow these instructions: [Creating a Repository](https://rdf4j.org/documentation/tools/server-workbench/#:~:text=for%20the%20repository.-,Creating%20a%20Repository,-Click%20on%20%E2%80%9CNew) (For repository type use for example Native Store.)
    * The logging configuration for RDF4j is hardcoded in the image, but it could override via `_pConfigURL` param. However, it is not a convenient format to work. Also both servies must to share volume or the config has to be exposed.

* Notes
  * volumes of `/tmp:/tmp` is currently required for sharing configuration for module debug
  * volumes of `/home:/home` is currently required for sharing the scripts
  * volumes of `/usr/local/tomcat/temp/` is currently required for sharing execution logs

![GitHub Logo](public/architecture.png)
Architecture images

### Note
> Skeleton is from - React Starter Boilerplate with Hot Module Replacement and Webpack 4

###License
Licensed under GPL v3.0.
