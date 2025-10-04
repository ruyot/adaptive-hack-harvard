from fastapi import FastAPI, Response, status
from pydantic import BaseModel
import sqlite3
from gemini import getConvoResponse

app = FastAPI()

class emailJson(BaseModel):
    email: str

class chatJson(BaseModel):
    convo: list[dict]

class RETURNS:
    class ERRORS:
        wrongAccessCode = {'message': "invalid access code"}

app.post('/getQuestion')
async def getquestion(q: int, item: emailJson, response: Response):
    # q is the accessCode
    con = sqlite3.connect('backend.db')
    cursor = con.cursor()
    res = cursor.execute("SELECT company, position FROM company_position WHERE accessCode = '%s'", q)
    if (res.rowcount == 0 ):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return RETURNS.ERRORS.wrongAccessCode
    company, position = res.fetchone()
    # TODO: call function to get the question

    response.status_code = status.HTTP_200_OK
    return {'question': question, 'doc': doc, 'company': company}
    
app.post('/chat')
async def chat(item: chatJson):


