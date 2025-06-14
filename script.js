document.addEventListener('DOMContentLoaded', () => {

    const path = window.location.pathname;
    if (path.includes('fazer_ocorrencia.html') || path.includes('ver_ocorrencias.html')) {
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        if (!usuarioLogado) {
            window.location.href = 'login.html';
        }
    }

    const formCadastro = document.getElementById('formCadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('cadastroNome').value;
            const email = document.getElementById('cadastroEmail').value;
            const telefone = document.getElementById('cadastroTelefone').value;
            const cpf = document.getElementById('cadastroCPF').value;
            const endereco = document.getElementById('cadastroEndereco').value;
            const cidade = document.getElementById('cadastroCidade').value;
            const estado = document.getElementById('cadastroEstado').value;
            const senha = document.getElementById('cadastroSenha').value;
            const confirmaSenha = document.getElementById('cadastroConfirmaSenha').value;

            if (senha !== confirmaSenha) {
                alert('As senhas não coincidem!');
                return;
            }

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            usuarios.push({ nome, email, telefone, cpf, endereco, cidade, estado, senha });
            localStorage.setItem('usuarios', JSON.stringify(usuarios));

            alert('Cadastro realizado com sucesso!');
            window.location.href = 'login.html';
        });
    }

    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const usuario = document.getElementById('loginUsuario').value;
            const senha = document.getElementById('loginSenha').value;

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const user = usuarios.find(u => (u.email === usuario || u.nome === usuario) && u.senha === senha);

            if (user) {
                localStorage.setItem('usuarioLogado', JSON.stringify(user));
                alert('Login realizado com sucesso!');
                window.location.href = 'fazer_ocorrencia.html';
            } else {
                alert('Usuário ou senha incorretos!');
            }
        });
    }


    window.logout = function() {

        localStorage.removeItem('usuarioLogado');

        window.location.href = 'login.html';
    };

    const formOcorrencia = document.getElementById('formOcorrencia');
    if (formOcorrencia) {
        formOcorrencia.addEventListener('submit', (e) => {
            e.preventDefault();
            const titulo = document.getElementById('tituloOcorrencia').value;
            const descricao = document.getElementById('descricaoOcorrencia').value;
            const imagem = document.getElementById('imagemOcorrencia').files[0];

            const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
            const autor = usuarioLogado ? usuarioLogado.nome : 'Desconhecido';

            const imagemUrl = imagem ? URL.createObjectURL(imagem) : null;

            ocorrencias.push({
                titulo, descricao, autor, imagemUrl
            });


            localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));

            alert('Ocorrência registrada com sucesso!');

            window.location.href = 'ver_ocorrencias.html';
        });
    }

    const listaOcorrencias = document.getElementById('listaOcorrencias');
    if (listaOcorrencias) {
        const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

        ocorrencias.forEach(ocorrencia => {
            const li = document.createElement('li');
            li.classList.add('ocorrencia-item');

            li.innerHTML = `<strong>${ocorrencia.titulo}</strong><br>${ocorrencia.descricao}<br><em>Enviado por: ${ocorrencia.autor}</em><br>`;

            if (ocorrencia.imagemUrl) {
                li.innerHTML += `<br><img src="${ocorrencia.imagemUrl}" alt="Imagem da ocorrência" class="imagem-ocorrencia">`;
            }

            if (usuarioLogado.tipo === 'admin' || usuarioLogado.nome === ocorrencia.autor) {
                li.innerHTML += `
                    <br>
                    <button class="btn-approve" onclick="aprovarOcorrencia('${ocorrencia.titulo}')">Aprovar</button>
                    <button class="btn-reject" onclick="rejeitarOcorrencia('${ocorrencia.titulo}')">Desaprovar</button>
                `;
            }

            listaOcorrencias.appendChild(li);
        });
    }

});

function aprovarOcorrencia(titulo) {
    const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
    const ocorrencia = ocorrencias.find(o => o.titulo === titulo);
    
    if (ocorrencia) {
        ocorrencia.status = 'Aprovada';
        localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));
        alert('Ocorrência aprovada!');
        location.reload();
    }
}

function rejeitarOcorrencia(titulo) {
    const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
    const ocorrencia = ocorrencias.find(o => o.titulo === titulo);

    if (ocorrencia) {
        ocorrencia.status = 'Rejeitada';
        localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));
        alert('Ocorrência desaprovada!');
        location.reload();
    }
}
