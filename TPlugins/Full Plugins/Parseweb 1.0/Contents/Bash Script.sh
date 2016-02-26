echo "Parseweb Package V 1.0"
prep(){
cd ~/Desktop
sudo mkdir ".py_scripts"
sudo mv PrintElement.py ~/Desktop/.py_scripts
sudo mv GetHTML.py ~/Desktop/.py_scripts
}
parseweb(){
export WEBADDRESS=$1
export ELEMENT=$2
cd ~/Desktop/.py_scripts
python PrintElement.py
python GetHTML.py
}