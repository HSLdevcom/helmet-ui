import sys
import json
import time

line = json.loads(sys.stdin.readline())
task = line["task"]
count = line["count"]

print('{"msg": "Running task: ' + task + '" }')
time.sleep(4)

for i in range(1, count):
    print('{"msg":"Working ' + str(i) + '/' + str(count-1) + '.."}')
    time.sleep(i)

print('{"msg":"Done."}')
time.sleep(4)
