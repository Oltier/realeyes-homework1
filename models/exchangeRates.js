module.exports ={
    identity: "exchangeRates",
    connection: "memory",
    attributes: {
        date: {
            type: 'string',
            required: true,
        },
        exchangeRates: [{
                currency: {
                    type: 'string',
                    required: true,
                },
                rate: {
                    type: 'float',
                    required: true,
                }
            }
        ]
    }
}