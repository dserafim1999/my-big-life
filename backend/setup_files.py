from pathlib import Path
from main.default_config import CONFIG
from os.path import join
import json

'''
Creates default file system for track storage and config file.
'''

def create_track_dirs(input_path, output_path, backup_path, life_path, life_all_path):
    """ Creates a default track directory hierarchy
    """

    Path(input_path).mkdir(parents=True, exist_ok=True)    
    Path(output_path).mkdir(parents=True, exist_ok=True)    
    Path(backup_path).mkdir(parents=True, exist_ok=True)    
    Path(life_path).mkdir(parents=True, exist_ok=True)
    Path(life_all_path).touch(exist_ok=True)

def create_config_file(input_path, output_path, backup_path, life_path, life_all_path):
    """ Creates a default config JSON file with the default track directories    
    """
    config = CONFIG

    config["input_path"] = input_path
    config["output_path"] = output_path
    config["backup_path"] = backup_path
    config["life_path"] = life_path
    config["life_all"] = life_all_path
    
    with open("config.json", "w") as config_file:
        json.dump(config, config_file, indent=4)

if __name__ == "__main__":
    input_path    = str(Path.cwd()) + '\\tracks\\input'
    output_path   = str(Path.cwd()) + '\\tracks\\output'
    backup_path   = str(Path.cwd()) + '\\tracks\\backup'
    life_path     = str(Path.cwd()) + '\\tracks\\life'
    life_all_path = str(Path.cwd()) + '\\tracks\\all.life'

    create_track_dirs(input_path, output_path, backup_path, life_path, life_all_path)
    create_config_file(input_path, output_path, backup_path, life_path, life_all_path)

    
         
    
