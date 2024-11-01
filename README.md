# SPipes Editor UI

SPipes Editor UI is editor of [SPipes](https://github.com/kbss-cvut/s-pipes) scripts with following features:
- visualization of the scripts
  - exploration of the related filesystem structure where scripts are located
  - represent the pipelines as graphs
  - collapse/expand groups of nodes based on the source file they come from
  - automatic layout of graph nodes
- modification of the scripts
  - notification if script file changes outside of the editor
  - custom editors for specific modules (e.g. SPARQL query editor)
  - editor to edit ttl directly
- execution of the scripts
  - execute scripts with parameters
  - explore the history of executions

We will use `$PROJECT_ROOT` as the root directory of this project, i.e., the directory where this README is located. Similarly, we will define:
- `$SPIPES_EDITOR_ROOT` -- root folder of cloned repository [s-pipes-editor](https://github.com/kbss-cvut/s-pipes-editor)
- `$SPIPES_MODULES_ROOT` -- root folder of cloned repository [s-pipes-modules](https://github.com/blcham/s-pipes-modules) 
- `$SPIPES_ROOT` -- root folder of cloned repository [s-pipes](https://github.com/kbss-cvut/s-pipes)
- `$SHARED_ROOT` -- root folder that you want to share between docker services and your host system. It is the folder that
  will be visible from docker services as well as from host filesytem and paths to all files will be the same.
  Thus one can copy absolute path to a file from docker service and open it from host filesystem and other way around.
  For linux the typical value would be `/home` or `/home/$user` and for windows the typical value would be `/host_mnt` or
  `/host_mnt/c/Users/user1/code`.
  
### Running Editor UI

Default configuration assumes that:
- you have **at least** docker-compose v2.20.2 (due to https://github.com/docker/cli/issues/4265; earlier versions were not tested)
- all relevant projects are "git cloned" as sibling directories to `$PROJECT_ROOT` (i.e. `$SPIPES_EDITOR_ROOT=$PROJECT_ROOT/../s-pipes-editor`, $SPIPES_MODULES_ROOT=$PROJECT_ROOT/../s-pipes-modules, and `$SPIPES_ROOT=$PROJECT_ROOT/../s-pipes`). 

Installing docker is summarized in [using-docker.md](./doc/using-docker.md).

There are two ways to run the editor, [using docker-compose](#running-editor-using-docker-compose) and [using spe](#running-editor-using-spe-script).

#### Running editor using docker-compose
To run the editor using `docker-compose`, do the following steps:
- `cd $PROJECT_ROOT/deploy
- if on Windows, create `$PROJECT_ROOT/deploy/.env` according to [Configuration of environment variables in Windows](#configuration-of-environment-variables-in-windows)
- `docker-compose up`
- open the editor in browser at `http://localhost:1235`. The editor should be showing [example scripts from SPipes repository](https://github.com/kbss-cvut/s-pipes/doc/examples).

#### Run editor using spe script

`spe` script can be used to execute the editor from a command line by specifying one or more directories from which SPipes scripts should be loaded. Internally the script uses [docker-compose.yml](https://github.com/kbss-cvut/s-pipes-editor-ui/blob/master/docker-compose.yml) file and environment variables specified in `$PROJECT_ROOT/deploy/.env.custom-script-paths`. 

To run the editor using `spe` script, do the following steps:
- if on Windows, create `$PROJECT_ROOT/deploy/.env.custom-script-paths` according to [Configuration of environment variables in Windows](#configuration-of-environment-variables-in-windows)
- `$PROJECT_ROOT/bin/spe.$EXTENSION <paths-to-script-folders>`
- open the editor in a browser at `http://localhost:1235`. The editor should show the script from folders specified in <paths-to-script-folders> and the folder $PROJECT_ROOT/../s-pipes-modules.

Use the correct spe script extension:
- Use `spe.sh` if in bash (both linux or wsl distribution).
- Use `spe.bat` if in  windows (both command prompt and powershell)

Note that in windows if using git with `core.autocrlf=true` (set by default) `spe.sh` (and other files) git will replace 
line endings (`LF`) for windows line endings (`CRLF`). In this case, the `spe.sh` script will not be executable in wsl. 
To make the script executable line endings should be replaced.


#### Configuration of environment variables in Windows
  `.env` file is used by docker compose by default. The `.env.custom-script-paths` is used by the `spe` script.
  - if running docker-compose.exe or spe.bat in windows  (not docker in wsl distribution) add the :
    - `SHARED_ROOT=/host_mnt/c`
    - `PWD=/host_mnt/$PROJECT_ROOT` _should be absolute path_
  - if running docker-compose or spe.sh in wsl distribution, set variables as follows:
    - `SHARED_ROOT=/mnt/c`


To override default configuration create `$PROJECT_ROOT/deploy/.env` and use following variables:
- `CUSTOM_SCRIPT_PATHS` -- to show different SPipes scripts (defaults to `${PROJECT_ROOT}/../s-pipes/doc/examples`).
  Use separator ";" to add multiple paths. The path must be absolute and the same as in host filesystem.
- `SCRIPTRULES` --  to set up different rules to validate SPipes scripts
  (defaults to `${PROJECT_ROOT}/../s-pipes-editor/src/main/resources/rules`),
- `RDF4J_SERVER_URL` -- to set up different Rdf4j server (defaults to internal docker service at `http://db-server:7200/`).
    **Note that this variable must be consistent with variable `RDF4J_PCONFIGURL`**.
- `RDF4J_REPOSITORYNAME` -- to set up different Rdf4j repository name where SPipes logs from execution are created
  (defaults to `s-pipes-hello-world`). **Note that this variable must be consistent with
  variable `RDF4J_PCONFIGURL`**.
- `RDF4J_PCONFIGURL` -- to set up configuration of Rdf4j repository where SPipes logs from execution are created
  (defaults to `$SPIPES_ROOT/doc/examples/hello-world/config.ttl`). **Note that this variable must be consistent with
  variables `RDF4J_SERVER_URL` and `RDF4J_REPOSITORYNAME`**.
- `SPIPES_ENGINE` -- to set up different s-pipes engine (defaults to internal docker service `http://s-pipes-engine:8080/s-pipes/`),
- `SPIPES_EDITOR_REST` -- to set up different s-pipes-editor backend (defaults to internal docker service `s-pipes-editor-rest:18115`).
- `INTERNAL_HOST_PORT` -- to set the port number on which application will be accessible within the internal network (defaults to internal docker service `1235`)
- `PUBLIC_ORIGIN` -- to set the base URL or domain where the application is publicly accessible.

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

## Development with Docker Compose
Here is the common procedure to debug individual services of the s-pipes-editor-ui. `<service-name>` can be replaced 
by one of the values `s-pipes-editor-ui`, `s-pipes-editor-rest` and `s-pipes-engine`. 
1. cd to `$PROJECT_ROOT/deploy`.
2. Run `docker-compose up` if not running already. Otherwise, run 
`docker-compose start`.
3. Stop the service which you want to develop `docker-compose stop <service-name>` 
4. Start `<service-name>` in development environment
   - `s-pipes-editor-ui` - run `npm run dev`
   - `s-pipes-editor-rest` - start run/debug springboot configuration in IntelliJ IDEA
   - `s-pipes-engine` - start run/debug springboot configuration in IntelliJ IDEA

Composing up, start and stop can also be done trough docker desktop and intellij idea service tab.

### Dockerization
The docker image of SPipes Editor UI can be built by `docker build -t s-pipes-editor-ui .`

Then, SPipes Editor UI can be run as `docker run -e SERVICE_URL=<SPIPES_BACKEND_URL> -p 3000:80 s-pipes-editor-ui`   
where <SPIPES_BACKEND_URL> denotes the URL where SPipes backend is running.

### Docker-compose

You can run editor together with backend using docker orchestration. The docker-compose is composed of 4 services and can be run via `docker-compose up`:
* [kbss-cvut/s-pipes-editor-ui:latest](https://ghcr.io/kbss-cvut/s-pipes-editor/s-pipes-editor-ui:latest) - accessible on `http://localhost:1235`
* [kbss-cvut/s-pipes-editor-rest:latest](https://ghcr.io/kbss-cvut/s-pipes-editor/s-pipes-editor:latest) - accessible on `http://localhost:1235/rest`
* [kbss-cvut/spipes-engine:latest](https://ghcr.io/kbss-cvut/s-pipes-engine/s-pipes-engine:latest) - accessible on `http://localhost:1235/services/s-pipes`
* [graphdb](./deploy/db-server) - accessible on `http://localhost:1235/services/db-server`

**Required manual steps:** 
* s-pipes-engine
    * The service does not automatically create the repository in GraphDB, so manual creation of a repository is required (after running `docker-compose up`).
      * First open the GraphDB Workbench: `http://localhost:<INTERNAL_HOST_PORT>/services/db-server/repository` where `<INTERNAL_HOST_PORT>` is the port specified in `.env`.
      * Then follow these [instructions](https://graphdb.ontotext.com/documentation/10.0/creating-a-repository.html).
    * The logging configuration for RDF4j is hardcoded in the image, but it could override via `_pConfigURL` param. However, it is not a convenient format to work. Also both servies must to share volume or the config has to be exposed.

* Notes
  * volumes of `/tmp:/tmp` is currently required for sharing configuration for module debug
  * volumes of `/home:/home` is currently required for sharing the scripts
  * volumes of `/usr/local/tomcat/temp/` is currently required for sharing execution logs

![GitHub Logo](public/architecture.png)
Architecture images

### Prettier

We use [Prettier](https://prettier.io/) to keep the codebase formatting consistent.
To simplify this process, a pre-commit Git hook is set up with [Husky](https://github.com/typicode/husky).

### Note
> Skeleton is from - React Starter Boilerplate with Hot Module Replacement and Webpack 4

###License
Licensed under GPL v3.0.
