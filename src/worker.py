import sys
import json
import time

line = json.loads(sys.stdin.readline())
emme = line['emme']
data = line['data']
iterations = line['iterations']

print('{"msg": "EMME-kansio: ' + emme + '"}')
time.sleep(3)

print('{"msg": "Data-kansio: ' + data + '"}')
time.sleep(3)

print('{"msg": "Suoritetaan ' + str(iterations) + ' iteraatiota.." }')
time.sleep(3)

for i in range(iterations):
    print('{"msg":"Iteraatio ' + str(i + 1) + '/' + str(iterations) + '.."}')
    time.sleep(1)

print('{"msg":"Valmis!"}')
time.sleep(4)
