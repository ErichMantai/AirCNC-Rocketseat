import React, { useState, useMemo} from 'react';
import camera from '../../assets/camera.svg';
import api from '../../services/api';

import './styles.css';

export default function New({ history} ) {
    const [company, setCompany] = useState('');
    const [techs, setTechs] = useState('');
    const [price, setPrice] = useState('');
    const [thumbnail,setThumbnail] = useState(null);

    const preview = useMemo(()=>{
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    },[thumbnail]
    ) //useMemo = observa um valor de uma determinada variável e cria uma preview com este novo valor alterado;

    async function handleSubmit(e) {
        e.preventDefault(); //não atualiza a página
        const data = new FormData();
        const user_id = localStorage.getItem('user');

        data.append('thumbnail',thumbnail); //concatena meus valores pra nandar na rota da api
        data.append('company',company);
        data.append('techs',techs);
        data.append('price',price);
        await api.post('/spots',data,{
            headers: { user_id }
        })
        
        history.push('/dashboard');
    }
    return (
       <form onSubmit={handleSubmit}>
        <label 
            id="thumbnail" 
            style={{ backgroundImage: `url(${preview}`}}
            className= {thumbnail ? 'has-thumbnail' : '' }
            >
            <input type="file" onChange={e=>setThumbnail(e.target.files[0])} />
            <img src={camera} alt="Select Img"/>
        </label>

           <label htmlFor="company">EMPRESA *</label>
           <input 
            id="company"
            placeholder="Sua empresa incrível"
            value={company}
            onChange={e=>setCompany(e.target.value)}
           />

        <label htmlFor="company">TECNOLOGIAS * <span>(Separadas por vírgula)</span></label>
        <input 
            id="techs"
            placeholder="Quais Tecnologias usam?"
            value={techs}
            onChange={e=>setTechs(e.target.value)}
        />

        <label htmlFor="price">Valor da diária</label>
        <input 
            id="price"
            placeholder="Valor Cobrado por dia"
            value={price}
            onChange={e=>setPrice(e.target.value)}
        />
        <button className = "btn">Cadastrar</button>
       </form> 
    )
}