function ft_profile() {
    document.querySelector('.sub-user').classList.toggle('show_user')
}

function ft_focus_desative(){
    document.getElementById('txt_busca').blur();
}

function ft_cards(text) {
    let validText;
    text == "" ? validText = "vazio" : validText = text

    document.querySelector('.list-cards').innerHTML = ""

    fetch(`/card/search/${validText}`)
        .then(response => response.json()) // Transformar a resposta em JSON
        .then(data => {

            let status_color

            data.forEach(card => {
                const item = document.createElement('div');
                item.classList.add('card');              

                if(card[4] == card[5])
                    status_color = 'orange'
                else
                    card[7] == 1 ? status_color = 'green' : status_color = 'red'

                item.innerHTML = `
                    <header>
                        <h6>${card[1]}</h6>
                    </header>
                    <span id="id">${card[0]}</span>
                    <b id="preco">${(card[3]).toLocaleString('pt-BR')}</b>
                    <span id="cliente">${card[6]}</span>
                    <span id="descrition">${card[2]}</span>
                    <span id="status" style='background:${status_color}'></span>
                `;

                document.querySelector('.list-cards').appendChild(item);

                // Adicione o evento onclick diretamente ao item criado
                item.onclick = () => {
                    alert(card[6])
                };
            });
        })
        .catch(error => {
            console.log(error)
        });
}

let quadros = 0
let id_cliente

function dataCart(code){
    fetch(`/card/buy/${code}`)
        .then(response => response.json()) // Transformar a resposta em JSON
        .then(data => {
            if(data[0][7] == 1)
            {
                id_cliente = data[0][0]
                document.querySelector('.quadros').innerHTML = ""
                document.querySelector('.modalCard').classList.toggle('showModal');
                document.getElementById('codigo').value = ""
                console.log(data)
                document.getElementById('preco_cliente').textContent = `${parseInt(data[0][3]).toLocaleString('pt-BR')},00`
                document.getElementById('titulo_cliente').textContent = data[0][1]
                document.getElementById('nome_cliente').textContent = data[0][6]
                document.getElementById('resp_cliente').textContent = data[0][2]

                let lim = data[0][4]
                let marked = data[0][5]
                quadros = marked
                let i = 1
                while(i <= lim)
                {
                    if(marked > 0)
                    {
                        document.querySelector('.quadros').innerHTML += `
                            <div class="quadro">X</div>
                        `
                    }
                    else{
                        document.querySelector('.quadros').innerHTML += `
                            <div class="quadro checked item${i}" onclick="marcar(${i})"></div>
                        `
                    }
                    i++;
                    marked--
                }
            }
            else
            {
                alert("cartao desativado")
                document.getElementById('codigo').value = ""
            }
        })
        .catch(error => {
            console.log(error)
        });
}

function marcar(index) {
    if (document.querySelector(`.item${index}`).classList.contains('checked')) {
        quadros++;
        document.querySelector(`.item${index}`).classList.remove('checked');
        document.querySelector(`.item${index}`).textContent = 'X';
    } else {
        quadros--;
        document.querySelector(`.item${index}`).classList.add('checked');
        document.querySelector(`.item${index}`).textContent = '';
    }
}


function concluir() {

    fetch(`/buy/${quadros}/${id_cliente}`)
        .then(response => response.json())
        .then(data => {
            if (data === "success") {
                document.querySelector('.modalCard').classList.toggle('showModal');
                ft_cards('')
            } else {
                alert("Erro ao atualizar o registro no servidor.");
                document.querySelector('.modalCard').classList.toggle('showModal');
            }
        })
}


ft_cards("");
