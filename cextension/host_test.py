from flask import Flask, render_template

app = Flask(__name__)
app.secret_key = 'oiqehf1.32183]134.13483124=1394,129cn0'

@app.route('/')
def index():
  return render_template('popout.html')
  
  
if '__main__' == __name__:
  app.run(port='8000',debug=True)