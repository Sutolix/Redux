import { select, call, put, all, takeLatest } from 'redux-saga/effects';
import { addReserveSuccess, updateAmountSuccess } from './actions';
import api from '../../../services/api';
import history from '../../../services/history';


/*Adicionar reservas*/
function* addToReserve({id}){
    /*Verifica se a trip existe retornando para a váriavel*/
    const tripExists = yield select(
        state => state.reserve.find(trip => trip.id === id)
    );
    
    //consulta pela api qual o stock da trip e define seu valor para a variavel
    const myStock = yield call(api.get, `/stock/${id}`);
    //desconstroi a variavel acima definindo uma variavel para o amount
    const stockAmount = myStock.data.amount;
    //se existir a tripExists define currentStock com seu valor se não, define como 0
    const currentStock = tripExists ? tripExists.amount : 0;
    //define o valor de amount
    const amount = currentStock + 1
    //trata o caso do amount exceder o stock
    if(amount > stockAmount){
        alert("O limite de reservas para essa viagem foi atingido!")
        return;
    }

    /*Define o que fazer dependendo da existência da trip*/
    if(tripExists){
        //atualiza o valor do amount
        yield put(updateAmountSuccess(id, amount));
    }else{
        //pega os dados da trip conforme seu id
        const response = yield call(api.get, `trips/${id}`)   
        //define o amount junto do response.data
        const data = {
            ...response.data,
            amount: 1,
        };
        //dispara a função que adiciona a reserva passando a const data
        yield put(addReserveSuccess(data));
        //manda para página de reservas quando a requisição estiver completa
        history.push('/reservas');
    }
}

/*Amount da page de minhas reservas*/
function* updateAmount({id, amount}){
    //impede que seja menor que 0
    if(amount <= 0) return;
    //armazena os dados da trip pelo seu id
    const myStock = yield call(api.get, `/stock/${id}`);
    //pega o amount da trip em especifico
    const stockAmount = myStock.data.amount;
    //caso o amount seja maior que a amount em stock retorna um alert
    if(amount > stockAmount){
        alert("O limite de reservas para essa viagem foi atingido!")
        return;
    }
    //tudo estando ok chama a funcão de update que é ouvida pelo reducer
    yield put(updateAmountSuccess(id, amount));
}


export default all([
    //o takeLatest é para caso o usuário clique rapidamente várias vezes seguidas no botão somente a última vez será considerada
    takeLatest('ADD_RESERVE_REQUEST', addToReserve),
    takeLatest('UPDATE_RESERVE_REQUEST', updateAmount),
])
