//generates pick slots in snake order

export function generatePickSlots(draftOrder, rounds) {
    const slots = [];
    let pickIndex = 0;

    for (let round = 0; round < rounds; round++){
        const isEvenRound = round % 2 === 1;
        const orderThisRound = isEvenRound 
        ? [...draftOrder].reverse() : draftOrder;

        for(const playerId of orderThisRound){
            slots.push({
                pickIndex,
                round: round + 1,
                playerId,
                movie: null
            });
            pickIndex++;
        }
    }
    return slots;
}