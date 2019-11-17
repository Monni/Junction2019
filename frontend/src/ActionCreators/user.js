export const vote = (initiative) => ({
   type: 'VOTE',
   payload: initiative,
});

export const joinChannel = (channel) => ({
    type: 'JOIN_CHANNEL',
    payload: channel,
})

export const createInitiative = (initiative) => ({
    type: 'CREATE_INITIATIVE',
    payload: initiative
})