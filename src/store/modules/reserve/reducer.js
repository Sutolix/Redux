import produce from 'immer';

export default function reserve(state = [], action) {
    switch (action.type) {
        case 'ADD_RESERVE':
            //state original e draft que será a copia dela onde faremos as modificações
            return produce(state, draft => {

                //Compara se já existe uma reserva com o mesmo id da qual está sendo adicionad
                //Caso houver, a resposta para essa constante será maior que 1
                const tripIndex = draft.findIndex(trip => trip.id === action.trip.id)

                if(tripIndex >= 0){
                    //ele(amount) igual a ele mais um
                    draft[tripIndex].amount +=1;
                }else{
                    //adiciona a trip
                    draft.push({
                        ...action.trip,
                        amount: 1,
                    });
                }
            });
        default:
            return state;
    }
}
