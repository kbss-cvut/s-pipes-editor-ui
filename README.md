# SPipes Editor UI

SPipes Editor UI is editor of [SPipes](https://github.com/kbss-cvut/s-pipes) scripts with following features:
- script visualization
  - browse the related filesystem structure where the scripts are stored
  - represent pipelines as interactive graphs
  - collapse/expand groups of nodes based on the source file
  - automatically layout graph nodes
- script modification
  - receive notifications if a script file changes outside the editor
  - use custom editors for specific modules (e.g., an SPARQL query editor)
  - directly edit .ttl files using a built-in editor
-  script execution
  - execute scripts with specified parameters
  - browse the history of previous executions

We will use `$PROJECT_ROOT` as the root directory of this project, i.e., the directory where this README is located. Similarly, we will define:
- `$SPIPES_EDITOR_ROOT` -- root folder of cloned repository [s-pipes-editor](https://github.com/kbss-cvut/s-pipes-editor)
- `$SPIPES_MODULES_ROOT` -- root folder of cloned repository [s-pipes-modules](https://github.com/blcham/s-pipes-modules) 
- `$SPIPES_ROOT` -- root folder of cloned repository [s-pipes](https://github.com/kbss-cvut/s-pipes)
- `$SHARED_ROOT` -- root folder that you want to share between docker services and your host system. It is the folder that
  will be visible from docker services as well as from host filesytem and paths to all files will be the same.
  Thus one can copy absolute path to a file from docker service and open it from host filesystem and other way around.
  For linux the typical value would be `/home` or `/home/$user` and for windows the typical value would be `/host_mnt` or
  `/host_mnt/c/Users/user1/code`, for MacOS typical value would be `/Users` or `/Users/$user`.
  
### Running Editor UI

Default configuration assumes that:
- you have **at least** Docker Compose v2.20.2 (due to https://github.com/docker/cli/issues/4265; earlier versions were not tested). If you have version 1.X.X, see the migration guide https://docs.docker.com/compose/releases/migrate/.
- all relevant projects are "git cloned" as sibling directories to `$PROJECT_ROOT` (i.e. `$SPIPES_EDITOR_ROOT=$PROJECT_ROOT/../s-pipes-editor`, $SPIPES_MODULES_ROOT=$PROJECT_ROOT/../s-pipes-modules, and `$SPIPES_ROOT=$PROJECT_ROOT/../s-pipes`). 

Installing docker is summarized in [using-docker.md](./doc/using-docker.md).

There are two ways to run the editor, [using docker compose](#running-editor-using-docker-compose) and [using spe](#running-editor-using-spe-script).

#### Running editor using Docker Compose
To run the editor using `Docker Compose`, do the following steps:
- `cd $PROJECT_ROOT/deploy
- if on Windows, create `$PROJECT_ROOT/deploy/.env` according to [Configuration of environment variables in Windows](#configuration-of-environment-variables-in-windows)
- `docker compose up`
- open the editor in browser at `http://localhost:1235`. The editor should be showing [example scripts from SPipes repository](https://github.com/kbss-cvut/s-pipes/doc/examples).

#### Run editor using spe script

`spe` script can be used to execute the editor from a command line by specifying one or more directories from which SPipes scripts should be loaded. Internally the script uses [docker-compose.yml](https://github.com/kbss-cvut/s-pipes-editor-ui/blob/master/deploy/docker-compose.yml) file and environment variables specified in `$PROJECT_ROOT/deploy/.env`. 

To run the editor using `spe` script, do the following steps:
- if on Windows, create `$PROJECT_ROOT/deploy/.env` according to [Configuration of environment variables in Windows](#configuration-of-environment-variables-in-windows)
- `$PROJECT_ROOT/bin/spe.$EXTENSION <paths-to-script-folders>`
- open the editor in a browser at `http://localhost:1235`. The editor should show the script from folders specified in <paths-to-script-folders> and the folder $PROJECT_ROOT/../s-pipes-modules.

Use the correct spe script extension:
- Use `spe.sh` if in bash (both linux or wsl distribution).
- Use `spe.bat` if in  windows (both command prompt and powershell)

Note that in windows if using git with `core.autocrlf=true` (set by default) `spe.sh` (and other files) git will replace 
line endings (`LF`) for windows line endings (`CRLF`). In this case, the `spe.sh` script will not be executable in wsl. 
To make the script executable line endings should be replaced.


#### Configuration of environment variables in Windows
`.env` file is used by Docker Compose by default.
- If running `docker compose` or `spe.bat` in Windows (not in a WSL distribution), add:
    - `SHARED_ROOT=/host_mnt/c`
    - `PWD=/host_mnt/$PROJECT_ROOT` _should be absolute path_
- If running `docker compose` or `spe.sh` in a WSL distribution, set variables as follows:
    - `SHARED_ROOT=/mnt/c`


    
### Environment Variables

To override the default configuration, create `$PROJECT_ROOT/deploy/.env` and use the following variables:

| Variable               | Description                                                                                                                                     | Default Value                                                    |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| `CUSTOM_SCRIPT_PATHS`  | Specifies different SPipes scripts. Use `;` as a separator to add multiple absolute paths matching the host filesystem.                         | `${PROJECT_ROOT}/../s-pipes/doc/examples`                        |
| `SCRIPTRULES`          | Defines rules for validating SPipes scripts.                                                                                                    | `${PROJECT_ROOT}/../s-pipes-editor/src/main/resources/rules`     |
| `RDF4J_SERVER_URL`     | Sets the Rdf4j server URL. **Must be consistent with `RDF4J_PCONFIGURL`**.                                                                      | Internal Docker service at `http://db-server:7200/`              |
| `RDF4J_REPOSITORYNAME` | Configures the Rdf4j repository name where SPipes logs are stored. **Must be consistent with `RDF4J_PCONFIGURL`**.                              | `s-pipes-execution-log`                                          |
| `RDF4J_PCONFIGURL`     | Specifies the configuration of the Rdf4j repository for SPipes logs. **Must be consistent with `RDF4J_SERVER_URL` and `RDF4J_REPOSITORYNAME`**. | `$SPIPES_ROOT/doc/examples/hello-world/config.ttl`               |
| `SPIPES_ENGINE_URL`    | Sets the SPipes engine endpoint.                                                                                                                | Internal Docker service at `http://s-pipes-engine:8080/s-pipes/` |
| `SPIPES_EDITOR_REST`   | Configures the SPipes editor backend endpoint.                                                                                                  | Internal Docker service at `s-pipes-editor-rest:18115`           |
| `INTERNAL_HOST_PORT`   | Defines the port number accessible within the internal network.                                                                                 | `1235`                                                           |
| `PUBLIC_ORIGIN`        | Specifies the base URL or domain for public access.                                                                                             | None                                                             |

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
2. Run `docker compose up` if not running already. Otherwise, run 
`docker compose start`.
3. Stop the service which you want to develop `docker compose stop <service-name>` 
4. Start `<service-name>` in development environment
   - `s-pipes-editor-ui` - run `npm run dev`
   - `s-pipes-editor-rest` - start run/debug springboot configuration in IntelliJ IDEA
   - `s-pipes-engine` - start run/debug springboot configuration in IntelliJ IDEA

Composing up, start and stop can also be done trough docker desktop and intellij idea service tab.

### Dockerization
The docker image of SPipes Editor UI can be built by `docker build -t s-pipes-editor-ui .`

Then, SPipes Editor UI can be run as `docker run -e SERVICE_URL=<SPIPES_BACKEND_URL> -p 3000:80 s-pipes-editor-ui`   
where <SPIPES_BACKEND_URL> denotes the URL where SPipes backend is running.

### Docker Compose

You can run editor together with backend using docker orchestration. The docker compose is composed of 4 services and can be run via `docker compose up`:
* [kbss-cvut/s-pipes-editor-ui:latest](https://ghcr.io/kbss-cvut/s-pipes-editor/s-pipes-editor-ui:latest) - accessible on `http://localhost:1235`
* [kbss-cvut/s-pipes-editor-rest:latest](https://ghcr.io/kbss-cvut/s-pipes-editor/s-pipes-editor:latest) - accessible on `http://localhost:1235/rest`
* [kbss-cvut/spipes-engine:latest](https://ghcr.io/kbss-cvut/s-pipes-engine/s-pipes-engine:latest) - accessible on `http://localhost:1235/services/s-pipes`
* [graphdb](./deploy/db-server) - accessible on `http://localhost:1235/services/db-server`

**Required manual steps:** 
* s-pipes-engine
    * The service does not automatically create the repository in GraphDB, so manual creation of a repository is required (after running `docker compose up`).
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
