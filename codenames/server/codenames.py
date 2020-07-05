#!/usr/bin/python

from bottle import route, post, run, request
from threading import RLock
import re
import json

mutex = RLock()

MAX_MESSAGE_LEN = 10000

SLEEP_TIME = 50
LONG_POLL_MAX_TIME = 2000

INITIAL = {"initialstate" : True}

@post('/update')
def codenamesUpdate():
    body = request.body.read(MAX_MESSAGE_LEN + 1)
    if len(body) > MAX_MESSAGE_LEN:
        return {"error" : "message too large!",
                "max-length" : MAX_MESSAGE_LEN}
    try:
        data = json.loads(body)
        lang = data["lang"]
        gameid = data["gameid"]
        prevstate = data["prevstate"]
        state = data["state"]
        with mutex:
            s = readstate(lang, gameid)
            if s != INITIAL and s != prevstate:
                return {"error" : "prevstate is not up to date"}
            writestate(lang, gameid, state)
        return {"success" : True}
    except ValueError:
        return {"error" : "Invalid json!"}
    except KeyError:
        return {"error" : "missing parameters!"}

datadir = "data/"

def valid(lang, gameid):
    return lang in ["en", "es", "fr", "pt", "jp"] and re.match("[a-zA-z0-9]+$", gameid)

def writestate(lang, gameid, state):
    if not valid(lang, gameid):
        return INITIAL
    with mutex:
        with open(datadir + lang + "/" + gameid, "w") as f:
            json.dump(state, f)


def readstate(lang, gameid):
    if not valid(lang, gameid):
        return INITIAL
    with mutex:
        try:
            with open(datadir + lang + "/" + gameid, "r") as f:
                return json.load(f)
        except IOError:
            return INITIAL

@route('/get')
def codenamesGet():
    if not request.params.lang or not request.params.gameid:
        return INITIAL
    lang = request.params.lang
    gameid = request.params.gameid
    totalWait = 0
    while True:
        state = readstate(lang, gameid)
        # TODO: Mejor hacer lo que sigue con un post, no con el get! Queda polling basico por ahora
        return {"lang" : lang, "gameid" : gameid, "state" : state}
        #if totalWait >= LONG_POLL_MAX_TIME or not request.params.prevstate or request.params.prevstate != state:
        #    return {"lang" : lang, "gameid" : gameid, "state" : state}
        #time.sleep(float(SLEEP_TIME) / 1000.0)
        #totalWait += SLEEP_TIME
        
if __name__ == "__main__":
    run(host="localhost", port=9999, server="paste")
