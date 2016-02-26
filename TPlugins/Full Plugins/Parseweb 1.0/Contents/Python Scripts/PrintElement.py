import os
element = os.getenv("ELEMENT")
noargs = os.getenv("NOARGS")
arg3 = os.getenv("ARG3")
arg4 = os.getenv("ARG4")
from bs4 import BeautifulSoup
file = open('source.txt', 'r')
txt = file.read()
soup = BeautifulSoup(txt, "html.parser")
if noargs == 2:
	mapsoup = soup.find_all(element)
elif noargs == 3:
	mapsoup = soup.find_all(element, {"class":arg3})
else:
	mapsoup = soup.find_all(element, id=arg4)

coolsoup = BeautifulSoup(str(mapsoup).replace("[", "").replace("]", "").replace(",", "\\n"), "html.parser")
epic = coolsoup.text
coolest = epic.replace("\\r", "").replace("\\n", "").replace("\\t", "")
print coolest
