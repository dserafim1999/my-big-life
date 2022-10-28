# Back-End
## Setup

Below you will find the steps to manually setup the backend.
### Requirements

The required Python libraries to run the backend server can be found in the "requirements.txt" file. To install them, you can run:

```
 $ pip install -r 'requirements.txt'
```

If you are using a virtual environment to install MyBigLife Backend's requirements, make sure to run the previous command with the virtual environment active.

**NOTE:** tracktotrip3 requires Microsoft Visual C++ 14.0. It can be found using the [Build Tools for Visual Studio 2022](https://visualstudio.microsoft.com/downloads/?q=build+tools)

### Configuration

A few parameters need to be adjusted in order to run the backend. A JSON file should be created so that it can be passed as a parameter when launching the program.

- **input_path**: defines the directory where the input .gpx files are located 
- **backup_path**: defines the directory where the original .gpx files are saved after processing  
- **output_path**: defines the directory where the processed .gpx files will be stored
- **life_path**: defines the directory where the [LIFE](https://github.com/domiriel/LIFE) files are located
- **life_all**: defines the path of the global [LIFE](https://github.com/domiriel/LIFE) file that will be updated after processing
- **db.host**: database host
- **db.port**: database port
- **db.name**: database name
- **db.user**: database user
- **db.pass**: database password

JSON File Example with required parameters:

```
{
    "input_path": "\input",
    "backup_path": "\backup",
    "output_path": "\output",
    "life_path": "\life",
    "life_all": "all.life",
    "db": {
        "host": "localhost",
        "port": "5432",
        "name": "postgres",
        "user": "postgres",
        "pass": "postgres"
    }
}
```

### Database

Database access is not mandatory, however some functionalities may not work. Create a [PostgreSQL 14](https://www.postgresql.org/download/) database with [PostGis 3.2](https://postgis.net/install/). The latter can be installed using Stack Builder, which comes bundled with the PostgreSQL instalation.

## Run


The program can be run by using the following command:

```
 $ python server.py --config [path_to_config_json]
```

The server is highly parameterable, use the following command for more options:

```
$ python server.py --help
```

## Reset Tracks

The database can be reset by running the following command:

```
 $ python reset_tracks.py
```

This command will also move the tracks saved in the backup folder back into the input folder, removing files from the output and life folders, in order to revert to the initial state for development.

## Adding a new manager

A manager's goal is to keep module specific logic self contained within their respective folders. The idea
is: as new functionality is introduced, its logic is contained in its own manager file which helps keep the system modular for work to come. 

### Create a python package

The first step is creating a new folder where the manager will be stored. To be able to import it in another file (such as, for instance, the server file) you need to add an empty file named ```__init__.py```. Then, you can import the package as follows:

```python
    from folder_name import manager_name
```

### Create the manager

After that, a manager file should be created containing a class. This class will inherit from the ```Manager``` class that is defined in [utils.py](utils.py). This base class will save the configurations provided to the server, as well as expose a mthod that creates a connection with the database called ```db_setup```.

### Create endpoints

After implementing the logic for your manager, it's time to link it to the server. Head to the [server](server.py) file and create a new instance of the manager. Then you can create the endpoints you wish to add to this manager. To keep endpoints consistent within their managers, a convention was set where you prefix the endpoint's route with a name that identifies the managers behaviour. For instance, if we wanted to add a 'play' endpoint to a video manager, we could name give it the route ```/video/play```. 

Below is an example of an enpoint for a ```GET``` request defined in the [server](server.py) file:

```Python
@app.route('/example', methods=['GET'])
def example_endpoint():
    data = [] # data will most likely originate from a manager method

    response = jsonify(data)
    return set_headers(response)
```

