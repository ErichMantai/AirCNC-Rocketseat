import React, { useState} from 'react';
import api from '../../services/api'; 

export default function Login({history} ) {
    const [email, setEmail] = useState(''); // atualiza a minha variável email, toda vez que executar o onChange

    async function HandleSubmit(event){
      event.preventDefault(); //não atualiza a página
      
    const response = await api.post("/sessions",{ email }); //acessa a rota e me retorna o valor
    const { _id } = response.data; //pega o id do meu response do json
  
    if (email != '') {
      localStorage.setItem('user',_id); //guarda o id no localstore para acesso na aplicação toda
      history.push('/dashboard'); //direciona o usuário para a rota dashboard
    }else {
      alert('Favor informar o Email!')
    }
  }

    return (
     <>
        <p>
          Ofereça <strong>spots</strong> para programadores e encontre <strong>talentos</strong> para sua empresa
        </p>

        <form onSubmit = {HandleSubmit}>
          <label htmlFor="email">E-mail *</label>
          <input 
           type="email" 
           id="email" 
           placeholder="Seu melhor e-mail"
           value={email}
           onChange={event => setEmail(event.target.value)}
          />
          <button className="btn" type="submit">Entrar</button>
        </form>
     </>          
    )
}