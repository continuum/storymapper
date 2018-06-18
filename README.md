# ModernStorymapperPrototype



This projects consists of a story mapper that uses [PivotalTracker's API](https://www.pivotaltracker.com/help/api/rest/v5), allowing us to better view the evolution of project features with regards to releases.

To do this, it requires that you provide it with your Pivotal Tracker API token, which you may obtain [in the API section of this page](https://www.pivotaltracker.com/profile)

Assuming you have a working installation of `docker`, `docker-compose` and `make` you can simply run `make` and wait for a while while the docker images/app & dependencies are installed

Afterwards, you can use `docker-compose run --service-ports web` to run the application (without `--service-ports` the application will not be accessible)
