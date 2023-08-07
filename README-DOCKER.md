# Using Docker
There are different ways to use docker. For example:
1. Docker desktop - for development purposes available on Windows, Max and Linux. Contains more than the docker engine
   and docker compose. It is free for personal use and learning. Not suitable for server environment.
2. Docker engine and docker compose - suitable for server environment, can be used for development purposes.

This document summarizes installation and setup of Docker engine and docker compose on Linux and Windows.
Contents:
* [Install Docker Engine and Docker Compose in Linux](#install-docker-engine-and-docker-compose-in-linux) - summarizes 
 installation steps of docker engine and docker compose in Ubuntu linux.   
* [Docker on Windows](#docker-on-windows) - summarizes usage scenarios and touches on some windows related specifics
* [Install Docker engine and docker compose in wsl distribution](#install-docker-engine-and-docker-compose-in-wsl-distribution) -
  summarizes installation of wsl, installing docker engine and docker compose in wsl distribution.
  * [Working with WSL](#working-with-wsl) - summarizes 

## Install Docker Engine and Docker Compose in Linux
To install docker Follow instructions below:
* Note: Copy and paste all shell commands in each code block. Do not copy and paste the commands in a code block line by line.
1. https://docs.docker.com/engine/install/ubuntu/
	* Note: If you do not have Ubuntu check installing on a different linux distributions here https://docs.docker.com/engine/install/
2. https://docs.docker.com/compose/install/standalone/

### Working with docker
* Start docker:

  `> sudo service docker start`

* Check docker service is running

  `> sudo docker ps` _see [Add username to docker group](#add-username-to-docker-group) if permission denied_

  or

  `> sudo service docker status`

### Add username to docker group
* find out your username

  `> whoami`

  output:`> your_username`

* edit /etc/group file in a text editor, for example:

  `> sudo vim /etc/group`

* find the line `docker:x:999:`

* changed it to
  `docker:x:999:your_username`
* save and exit the editor.

## Docker on Windows
Docker can be installed and used on windows in several ways. For example:
1. Using docker directly from windows
2. Using docker from a wsl distribution

Combining these two scenarios with the two scenarios from section [Using Docker](#using-docker)
1. Docker desktop installed directly on windows.
2. Docker engine and docker compose installed directly on windows. Should be possible, not tested.
3. Docker desktop installed in a wsl distribution. Should be possible, not tested.
4. Docker engine and docker compose installed in a wsl distribution.

Scenario 1. Docker creates two wsl distributions `docker-desktop-data` and `docker-desktop` to enable running linux 
docker images on windows. Not sure how wsl is used in scenario 2.

Scenario 3. and 4. a linux distribution is installed in wsl and docker components are installed inside.

It all scenarios host paths when mapping volumes should use a prefix:
* For docker installed in windows (not in wsl distribution) (scenarios 1. and 2.) - host paths should be prefixed with
  `/host_mnt/`. For exmaple, `/host_mnt/c/users/user1`.
* For docker installed in windows in wsl distribution (scenarios 3. and 4.) - host paths should be prefixed with
  `/mnt/`. For exmaple, `/mnt/c/users/user1`.

Scenario 1. is the simplest.
To setup scenario 3. see [Install Docker engine and docker compose in wsl distribution](#install-docker-engine-and-docker-compose-in-wsl-distribution).

## Install Docker Engine and Docker Compose in WSL Distribution
1. Install wsl and a linux distribution - see section [Install WSL](#install-wsl)
2. Install docker engine and docker compose in WSL
	1. Enter a linux distribution in wsl

	   `> wsl -d Ubuntu-22.04`
	2. Follow instructions in section [Installation of docker in WSL should be the same as installing docker on linux](#install-docker-engine-and-docker-compose-in-linux).


### Working with WSL

This section summarizes installation and usage of WSL.

#### Install WSL
Install wsl and a linux distribution
1. Install wsl - See section "Install WSL command" in https://learn.microsoft.com/en-us/windows/wsl/install
2. Install Ubuntu distribution (e.g. Ubuntu-22.04) - see section "Change the default Linux distribution installed" in https://learn.microsoft.com/en-us/windows/wsl/install.


	Note: Alternatively WSL and the distribution can be installed from the Microsoft store.

#### Using WSL
**Control resources dedicated to wsl**
- Create file "c:/users/<username>/.wslconfig"
- set resources :
	

	[wsl2]
    memory=6GB
    processors=4
- for more info see https://learn.microsoft.com/en-us/windows/wsl/wsl-config

**Some useful wsl commands**:
* Wsl help

  `> wsl --help`
* List installed distributions

  `> wsl -l (same as wsl --list)`
* List distributions available online

  `> wsl -l -o (same as wsl --list -online)`

* Install distribution

  `> wsl --install Ubuntu-22.04`

* enter distribution

  `> wsl -d Ubuntu-22.04 (same as wsl -distribution Ubuntu-22.04)`
