# pip install requests
import requests
from bs4 import BeautifulSoup
import csv

link = "https://www.npr.org/2020/11/16/934584373/transcript-nprs-full-interview-with-former-president-barack-obama"
page = requests.get(link)

soup = BeautifulSoup(page.content, 'html.parser')

martin = []
obama = []
L = soup.find_all("p")

for p in range(3,75):
    if p % 2:
        martin.append(L[p].get_text())
    else:
        obama.append(L[p].get_text())

with open('obama_transcript.csv', 'w') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    for i in range(0,len(martin)):
        writer.writerow([martin[i],obama[i]])

