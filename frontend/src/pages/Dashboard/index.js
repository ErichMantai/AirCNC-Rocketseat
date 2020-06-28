import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';
import socketio from 'socket.io-client';  

export default function Dashboard() {
    const [spots, setSpots] = useState([]);
    const [request,setRequest] = useState([]); 
    
    const user_id = localStorage.getItem('user');  
    const socket =  useMemo(() => socketio('http://192.168.0.108:3333', {
        query : { user_id },  
      }),[user_id]) ;

    useEffect(() => {  
      socket.on('booking_request', data => {
        setRequest([ ...request, data]);  
      })
    }, [request, socket]);

    useEffect(()=>{
      async function loadSpots(){
        const user_id = localStorage.getItem('user'); //capturo o id que inseri no local storage no momento que o usuário logou na aplicação
          const response = await api.get('/dashboard',{
              headers: { user_id }
          });

          setSpots(response.data); //atualiza automatico 
      } 
      loadSpots(); //chamo meu método 
    }, []); //quando passado vazio eu garanto que minha função vai execultar uma única vez(onShow)

    async function handleAccept(id) {
      await api.post(`/bookings/${id}/approvals`);

      setRequest(request.filter(request=> request._id != id)) //ele tira todos os bookings que ja foram aprovados da lista
    }

    async function handleReject(id){
      await api.post(`/bookings/${id}/rejects`);

      setRequest(request.filter(request=> request._id != id))
    }

    return (
      <>
        <ul className = "notifications">
           { request.map(request=> (
             <li key = {request.id}>
               <p>
                <strong>{request.user.email}</strong> está solicitando uma reserva em <strong>{request.spot.company}</strong> para a data: <strong>{request.date}</strong>
               </p>
                <button className="accept" onClick={()=>handleAccept(request._id)}>Aceitar</button>
                <button className="reject" onClick={()=>handleReject(request._id)}>Rejeitar</button>
             </li>
           ))}
        </ul>
           <ul className = "spot-list">
            {spots.map(spot => (
                <li key={spot._id}>
                   <header style={{ backgroundImage: `url(${spot.thumbnail_url})`}} />
                   <strong>{spot.company}</strong>
                   <span>{spot.price ? `R$${spot.price}/dia` : 'Gratuito'}</span>                        
                </li>
            ))}
          </ul> 

          <Link to="/new">
           <button className="btn">Cadastrar novo Spot</button> 
          </Link> 
      </>
    )
}