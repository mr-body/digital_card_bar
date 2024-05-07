from flask import Flask, render_template, send_from_directory, redirect, session, url_for, request, current_app, jsonify
from functools import wraps
from classes.easyLite import SQLiteDB

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

query = SQLiteDB('../database/data.db')

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# ///////////////////////////////////////////////////////////////////////////////////////////////
# inicializacao login e outros...

dadosLogin = []

@app.route('/')
@login_required
def index():
    return redirect(url_for('card', id=session['user']['id']))

@app.route('/login', methods=['GET'])
def login():
    if 'logged_in' not in session:
        return render_template('login.html')
    else:
        return redirect(url_for('card', id=session['user']['id']))

@app.route('/login', methods=['POST'])
def login_post():
    username = request.form.get('username')
    password = request.form.get('password')

    user_data = query.login(username, password)
    if user_data:
        session['logged_in'] = True
    
        session['user'] = user_data
        dadosLogin = user_data
        return redirect(url_for('index'))
    else:
        return render_template('login.html', error=True)
    
@app.route('/logout')
def logout():
    session.pop('logged_in', None) 
    return redirect(url_for('login'))





















# ///////////////////////////////////////////////////////////////////////////////////////////////
# web app

@app.route('/card/<id>')
@login_required
def card(id):
    id = str(id)  # Convertendo o id para string
    if id == str(session['user']['id']):
        return render_template('card.html', user=session['user'])
    else:
        return "<center><h1>ID do usuário não encontrado</h1></center>"

@app.route('/card/search/<text>')
def search_card(text):
    if text != "vazio":
        query_string = f"SELECT * FROM cartao WHERE id LIKE '%{text}%' OR cliente LIKE '%{text}%'"
    else:
        query_string = f"SELECT * FROM cartao"

    cards = query.select_data(query_string)
    return jsonify(cards)

@app.route('/card/buy/<text>')
def search_card_to_buy(text):
    query_string = f"SELECT * FROM cartao WHERE id = '{text}'"
    card = query.select_data(query_string)
    return jsonify(card)

@app.route('/buy/<quadros>/<id_cliente>')
def update(quadros, id_cliente):
    query_string = f"UPDATE cartao set qtd_Checked  = {quadros} where id = {id_cliente}"
    if(query.execute_query(query_string)):
        return jsonify("success")
    else:
        return jsonify("error")







































# ///////////////////////////////////////////////////////////////////////////////////////////////
# arquivos js (javascript)

@app.route("/static/js/script.js")
def script():
    return current_app.send_static_file("js/script.js")

@app.route("/static/libs/easyTabs.js")
def easyTabs():
    return current_app.send_static_file("libs/easyTabs.js")

# ///////////////////////////////////////////////////////////////////////////////////////////////
# rotas

@app.route('/custom/<path:filename>')
def custom(filename):
    return send_from_directory(filename)

@app.errorhandler(404)
def page_not_found(error):
    return "Página não encontrada. Verifique o URL e tente novamente.", 404

@app.errorhandler(500)
def internal_server_error(error):
    return "Ocorreu um erro interno do servidor. Por favor, tente novamente mais tarde.", 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=2005)
