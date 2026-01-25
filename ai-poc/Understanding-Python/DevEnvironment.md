# The dev environment
I've been following the (https://flask.palletsprojects.com/en/2.3.x/installation/)[Installation] guide. This means that I set up a virtual environment inside the `src/API` folder.  
I activated the environment by using the `. .venv/bin/activate` command. Inside this environment I ran the `pip install Flask` command to install Flask.  
After that I ran the `pip freeze > requirements.txt` command so the virtual environment will contain a list of dependencies that each developer needs in their environment to start working.

# Troubleshooting
## Import "..." could not be resolved
![ImportCouldNotBeResolved](Images/Import%20could%20not%20be%20resolved.png)  
When you get this error your VSCode is using the wrong python interpreter.  You need to point your VSCode to the Python interpreter of your virtual environment.  When you created your venv using the python3 command (like: `python3 -m venv .venv`) you can run this command inside your venv: `which python` to get the path to the interpreter that your venv uses.  
Now you press `Ctrl+Shift+P` and type `Python: Select Interpreter` press Enter.  Then select `Enter interpreter path..` then you select the file you got from using the `which python` command and that should fix it.
