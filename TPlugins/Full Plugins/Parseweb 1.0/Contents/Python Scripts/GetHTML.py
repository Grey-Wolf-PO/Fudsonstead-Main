import os
web = os.getenv('WEBADDRESS')
import urllib2
user_agent = 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.0.7) Gecko/2009021910 Firefox/3.0.7'
headers={'User-Agent':user_agent} 
link = urllib2.Request(web, headers=headers)
f = urllib2.urlopen(link)
myfile = f.read()
x = open('source.txt', 'w')
x.write(myfile)
x.close
