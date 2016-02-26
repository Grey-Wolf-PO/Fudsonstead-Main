echo "In-Shell JS IDLE 1.0"
prep(){
        cd ~/Desktop
        sudo mkdir ".jsidlepackages"
}
jsidle(){
        cd ~/Desktop/.jsidlepackages
        if [ "$2" == "-e" ]
        then
        sudo nano "$1"
        else
        sudo touch "$1"
        fi
        sudo nano "$1"
}
jsrun(){
        cd ~/Desktop/.jsidlepackages
        node "$1"
}
mvscript(){
        cd ~/Desktop/.jsidlepackages
        cp "$1" ..
}
