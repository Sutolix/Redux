import { select, call, put, all, takeLatest } from 'redux-saga/effects';
import { addReserveSuccess, updateAmountReserve } from './actions';
import api from '../../../services/api';

function* addToReserve({id}){
    /*Verifica se a trip existe retornando para a váriavel*/
    const tripExiste = yield select(
        state => state.reserve.find(trip => trip.id === id)
    );
    /*Define o que fazer dependendo da existência da trip*/
    if(tripExiste){
        //aumenta o amount
        const amount = tripExiste.amount + 1;
        //atualiza o valor do amount
        yield put(updateAmountReserve(id, amount));
    }else{
        //pega os dados da trip conforme seu id
        const response = yield call(api.get, `trips/${id}`)   
        //define o amount junto do response.data
        const data = {
            ...response.data,
            amount: 1,
        };
        //dispara a função que adiciona a reserva passando a const data
        yield put(addReserveSuccess(data))
    }
}

export default all([
    //caso o usuário clique várias vezes seguidas no botão somente a última vez será considerada
    takeLatest('ADD_RESERVE_REQUEST', addToReserve)
])
