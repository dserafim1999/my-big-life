# MyBigLife

_MyBigLife_ enables users to easily process, analyse and query their spatial and temporal information with a strong emphasis on personal semantics and the power they have over their own data. 

## Setup

To setup the system automatically, you can run the [setup](setup.bat) batch script. [Python3](https://www.python.org/downloads/) with _pip_ is required for the back-end, and [node.js](https://nodejs.org/en/download/) with _npm_ is required for the front-end.

**NOTE:** The Python dependency tracktotrip3 requires Microsoft Visual C++ 14.0. It can be found using the [Build Tools for Visual Studio 2022](https://visualstudio.microsoft.com/downloads/?q=build+tools) and should be installed before running the setup script.

Instructions to manually setup the back-end and front-end can be found in their repsective _README_ files.

## Configuration

A few parameters need to be adjusted in order to run the backend. A JSON file should be created so that it can be passed as a parameter when launching the program. A default configuration file, as well as the required directories, will be created and ignored in the _.gitignore_ when running the [setup](setup.bat) script. However, you can define another configurations file and directories if you so desire. 

The required parameters are:
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

## Database

Database access is not mandatory, however some functionalities may not work. Create a [PostgreSQL 14](https://www.postgresql.org/download/) database with [PostGis 3.2](https://postgis.net/install/). The latter can be installed using Stack Builder, which comes bundled with the PostgreSQL instalation.

## Run

To run both the back-end and front-end instances you can use the [run](run.bat) batch script.

To run them individually, you can use the following commands in the terminal:

### Back-End

The back-end can be run by using the following command:

```
 $ python server.py --config [path_to_config_json]
```

The server is highly parameterable, use the following command for more options:

```
$ python server.py --help
```

#### Reset

The database can be reset by running the [reset_database](reset_database.bat) batch script.

This command will also move the tracks saved in the backup folder back into the input folder, removing files from the output and life folders, in order to revert to the initial state for development.

### Front-End

The front-end can be run by using the following command:

```
    $ npm run dev
```

To access the program, open the browser at ``` http://localhost:3000 ```